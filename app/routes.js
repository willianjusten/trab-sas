var libnmap      = require('node-libnmap');
var iptables     = require('iptables');

module.exports = function(app, passport){

    // Home
    app.get('/', function(req, res){
        res.render('index.ejs');
    });

    // Login
    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // Login action
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/system',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // Signup View
    app.get('/signup', function(req, res){
        res.render('signup.ejs', { message: req.flash('signupMessage')});
    });

    // Signup Register
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/system',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // Unlink Account
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.remove({_id: user._id});
        user.save(function(err) {
            res.redirect('/');
        });
    });

    // Page system
    app.get('/system', isLoggedIn, function(req, res){
        res.render('system.ejs', {
            user : req.user
        });
    });

    // Logout
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    // NMAP
    // ====================================

    // Nmap View
    app.get('/nmap', isLoggedIn, function(req, res){
        res.render('nmap.ejs');
    });

    // Nmap discover
    app.get('/nmap/discover', function(req, res) {
        libnmap.nmap('discover', function(err, report){
          res.header("Access-Control-Allow-Origin", "*");
          res.json(report);
          console.log(report);
        })
    });

    // Nmap Scan
    app.get('/nmap/scan/:ip', function(req, res){
        var opts = {
          range: [req.params.ip]
        }

        libnmap.nmap('scan', opts, function(err, report){
          if (err) throw err

          report.forEach(function(item){
            res.header("Access-Control-Allow-Origin", "*");
            res.json(item[0]);
            console.log(item[0]);
          })
        })
    });

    // IPtables
    // ====================================

    // Iptables View
    app.get('/iptables', isLoggedIn, function(req, res){
        res.render('iptables.ejs');
    });

    app.get('/iptables/:ip/:chain/:rule', function(req, res){
        var ip    = req.params.ip;
        var chain = req.params.chain;
        var rule  = req.params.rule;

        if (rule === 'ACCEPT'){
            iptables.allow({
                src : ip,
                chain: chain,
                sudo : true
            });

            res.send("<div class='dsp-tb'><p class='rule'>Ip: "+ip+" - Chain: "+chain+" - Rule: "+rule+"</p><a class='btn btn-danger' href='/iptables/"+ip+"/"+chain+"/"+rule+"/del'><i class='fa fa-trash'></i> Delete</a></div>")
        }
        else {
            iptables.drop({
                src : req.params.ip,
                chain: req.params.chain,
                sudo : true
            });

            res.send("<div class='dsp-tb'><p class='rule'>Ip: "+ip+" - Chain: "+chain+" - Rule: "+rule+"</p><a class='btn btn-danger' href='/iptables/"+ip+"/"+chain+"/"+rule+"/del'><i class='fa fa-trash'></i> Delete</a></div>")
        }
    });

};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();

    res.redirect('/');
}
var libnmap      = require('node-libnmap');

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
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();

    res.redirect('/');
}
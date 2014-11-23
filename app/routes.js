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
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();

    res.redirect('/');
}
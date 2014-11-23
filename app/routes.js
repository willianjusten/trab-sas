module.exports = function(app, passport){

    // Home
    app.get('/', function(req, res){
        res.render('index.ejs');
    });

    // Login
    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // Signup
    app.get('/signup', function(req, res){
        res.render('signup.ejs', { message: req.flash('signupMessage')});
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

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
            return next();

        res.redirect('/');
    }
}
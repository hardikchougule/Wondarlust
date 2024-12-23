const user = require("../models/user.js");

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const registerUser = await user.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome To Wonderlust");
            res.redirect("/listings");
        });
       
    } catch (e) {
        req.flash("error", e.message);
        res.render("/signup");
    }
};

module.exports.rendersingupform= (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login=   async (req, res) => {
    req.flash("success","welcome to wonderlust! you are loggedin!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout= (req,res)=>{
    req.logOut((err)=>{
       if(err){
          return next();
       }
       req.flash("success","you logout successfully");
       res.redirect("/listings");
    })
}; 
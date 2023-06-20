// controllers > authController.js
const asyncHandler = require("express-async-handler");

module.exports = function(passport){
  const auth_login_post = asyncHandler((req, res, next) => {  
    if (typeof res.locals.validation !== "undefined") {
      res.render("member_login", {
        title: "Member Login",
        username: req.body.username,
        errors: res.locals.validation.errors,
      });
      return;
    }
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        console.log('err')
        return next(err);
      }
      if (!user) {
        console.log('!user')
        return res.render("member_login", {
          title: "Member Login",
          username: req.body.username,
          errors: [{msg: 'Failed to authenticate' }],
        });
      } else {
        return req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/clubhouse/comments");
        });
      }
    })(req,res,next);
  });

  const auth_logout_get = asyncHandler((req, res, next) => {  
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.render("member_logout", {title: 'Member Logout'});
    });
  });

  return {
    auth_login_post,
    auth_logout_get
  }
}

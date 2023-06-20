// config > passport.js
module.exports = function(passport, LocalStrategy){
  console.log("loading config > passport.js");

  const bcrypt = require("bcryptjs");
  const Member = require("./../models/member");

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await Member.findById(id, { userName: 1, role: 1, firstName: 1, lastName: 1,  });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await Member.findOne({ userName: username });
        if (!user) {
          return done(null, false, { message: "Invalid username (auth)" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords return user
            return done(null, user);
          } else {
            // passwords !match
            return done(null, false, {
              message: "Incorrect password (auth)",
              username: username,
            });
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  ));
};
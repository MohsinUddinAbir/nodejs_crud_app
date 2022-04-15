const { signVerify } = require("../wares");

var passport = require("passport");
var LocalStrategy = require("passport-local");
const { Op } = require("sequelize");
var bcrypt = require("bcryptjs");
var db = require("../models");
var User = db.user;

module.exports = function (app) {
   app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
      next();
   });

   passport.use(
      new LocalStrategy(function verify(username, password, cb) {
         User.findOne({
            where: {
               [Op.or]: [{ username: username }, { email: username }],
            },
         })
            .then((user) => {
               if (!user) {
                  return cb(null, false, { message: "Incorrect username or email." });
               }

               var passwordIsValid = bcrypt.compareSync(password, user.password);
               if (!passwordIsValid) {
                  return cb(null, false, { message: "Incorrect password." });
               }
               return cb(null, user);
            })
            .catch((err) => {
               return cb(err);
            });
      })
   );

   passport.serializeUser((user, cb) => {
      process.nextTick(() => {
         cb(null, { id: user.id, username: user.username });
      });
   });

   passport.deserializeUser((user, cb) => {
      process.nextTick(() => {
         return cb(null, user);
      });
   });

   app.get("/signup", (req, res, next) => {
      res.layout("signup", { title: "Signup" });
   });

   app.get("/login", (req, res, next) => {
      res.layout("login", { title: "Login" });
   });

   app.post("/logout", (req, res, next) => {
      req.logout();
      res.redirect("/");
   });

   app.post("/signup", signVerify.checkDuplicateUsernameOrEmail, (req, res, next) => {
      User.create({
         username: req.body.username,
         email: req.body.email,
         password: bcrypt.hashSync(req.body.password, 8),
      })
         .then((user) => {
            req.login(user, (err) => {
               if (err) {
                  return next(err);
               }
               res.redirect("/");
            });
         })
         .catch((err) => {
            return next(err);
         });
   });

   app.post(
      "/login/password",
      passport.authenticate("local", {
         successReturnToOrRedirect: "/",
         failureRedirect: "/login",
         failureMessage: true,
      })
   );
};

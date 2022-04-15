const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
const moment = require("moment");
const db = require("../models");
const User = db.user;
const Post = db.post;

module.exports = function (app) {
   app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
      next();
   });

   app.get(
      "/",
      (req, res, next) => {
         if (!req.user) {
            return res.layout("login", { title: "Login" });
         }
         next();
      },
      async (req, res, next) => {
         res.locals.filter = null;

         const posts = await Post.findAll({
            where: {
               status: 1,
            },
            include: { model: User, attributes: ["id", "username", "email", "about", "image"] },
            order: [["createdAt", "DESC"]],
            offset: 0,
            limit: 5,
         });

         const truncate = (str, num) => (str.length > num ? str.slice(0, num) + "..." : str);

         res.layout("index", { title: "Home", user: req.user, posts: posts, moment, truncate });
      }
   );
};

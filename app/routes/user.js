const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
const { Op } = require("sequelize");
const db = require("../models");
const User = db.user;
const Friend = db.friend;
const { uploadFiles } = require("../wares");

module.exports = function (app) {
   app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
      next();
   });

   app.get("/profile/:username", ensureLoggedIn(), async (req, res) => {
      let tuser = await User.findOne({
         where: {
            username: req.params.username,
         },
         include: {
            model: User,
            as: "friend",
            through: "friends",
            order: [["createdAt", "DESC"]],
            attributes: ["id", "username", "email", "about", "image"],
         },
      });
      if (tuser && (tuser.visible || tuser.id == req.user.id)) {
         return res.layout("users/profile", { title: "Profile", user: req.user, tuser: tuser });
      }
      res.redirect("/");
   });

   app.get("/profile/:username/edit", ensureLoggedIn(), async (req, res) => {
      if (req.user.username == req.params.username) {
         let user = await User.findByPk(req.user.id);
         res.layout("users/edit", { title: "Edit Profile", user: user });
         return;
      }
      res.redirect("/profile/" + req.params.username);
   });

   app.post("/profile/:username/update", [ensureLoggedIn(), uploadFiles.uploadImage], async (req, res) => {
      let user = await User.findByPk(req.user.id);
      user.about = req.body.about;
      user.visible = req.body.visible;
      user.image = req.image_url || user.image;
      await user.save();
      res.redirect("/profile/" + req.user.username);
   });

   app.post("/add_friend/:username", ensureLoggedIn(), async (req, res) => {
      let user = await User.findOne({ where: { username: req.user.username } });
      let friend = await User.findOne({ where: { username: req.params.username } });
      if (user && friend) {
         await user.addFriend(friend, { through: { selfGranted: false } });
         res.redirect("/profile/" + req.user.username);
         return;
      }
      res.redirect("/");
   });

   app.post("/remove_friend/:username", ensureLoggedIn(), async (req, res) => {
      let user = await User.findOne({ where: { username: req.user.username } });
      let friend = await User.findOne({ where: { username: req.params.username } });
      if (user && friend) {
         await user.removeFriend(friend, { through: { selfGranted: false } });
         res.redirect("/profile/" + req.user.username);
         return;
      }
      res.redirect("/");
   });
};

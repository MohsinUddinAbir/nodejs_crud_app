const { uploadFiles } = require("../wares");
const { Op } = require("sequelize");
const slugify = require("slugify");
const db = require("../models");
const moment = require("moment");
const User = db.user;
const Post = db.post;

const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

module.exports = function (app) {
   app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
      next();
   });

   app.get("/posts", async (req, res) => {
      let limit = 10;
      let page = req.query.page || 0;
      let offset = page * limit;
      let search = req.query.search ? "%" + req.query.search + "%" : "%%";
      const { count, rows: posts } = await Post.findAndCountAll({
         // raw: true,
         include: { model: User, attributes: ["id", "username", "email", "about", "image"] },
         where: {
            title: {
               [Op.like]: search,
            },
            status: 1,
         },
         order: [["createdAt", "DESC"]],
         offset: offset,
         limit: limit,
      });
      const truncate = (str, num) => (str.length > num ? str.slice(0, num) + "..." : str);
      res.layout("posts/posts", { title: "Posts", user: req.user, posts: posts, count: count, moment, truncate });
   });

   app.get("/posts/:id/:slug", async (req, res) => {
      let post = await Post.findByPk(req.params.id, {
         include: { model: User, attributes: ["id", "username", "email", "about", "image"] },
      });

      res.layout("posts/details", { title: post.title, user: req.user, post: post, moment: moment });
   });

   app.get("/posts_create", async (req, res) => {
      res.layout("posts/create", { title: "Create Post", user: req.user, post: {} });
   });

   app.post("/posts_store", [ensureLoggedIn(), uploadFiles.uploadPosts], async (req, res) => {
      let slug = slugify(req.body.title, "_");
      await Post.create({
         title: req.body.title,
         body: req.body.body,
         image: req.image_url,
         user_id: req.user.id,
         slug: slug,
      });
      res.redirect("/posts");
   });

   app.get("/posts_edit/:id/", [ensureLoggedIn(), uploadFiles.uploadPosts], async (req, res) => {
      let post = await Post.findByPk(req.params.id);
      if (post && post.user_id == req.user.id) {
         return res.layout("posts/edit", { title: "Edit Post", user: req.user, post: post });
      }
      res.redirect("/posts");
   });

   app.post("/posts_update/:id/", [ensureLoggedIn(), uploadFiles.uploadPosts], async (req, res) => {
      let slug = slugify(req.body.title, "_");
      let post = await Post.findByPk(req.params.id);
      if (post && post.user_id == req.user.id) {
         post.title = req.body.title;
         post.body = req.body.body;
         post.slug = slug;
         post.image = req.image_url || post.image;
         await post.save();
      }
      res.redirect("/posts/" + post.id + "/" + post.slug);
   });

   app.post("/posts_delete/:id/", ensureLoggedIn(), async (req, res) => {
      let post = await Post.findByPk(req.params.id);
      if (post && post.user_id == req.user.id) {
         await post.destroy();
      }
      res.redirect("/posts");
   });
};

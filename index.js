const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require("http").Server(app);
const cookieParser = require("cookie-parser");
const session = require("express-session");
const csrf = require("csurf");
const passport = require("passport");
const logger = require("morgan");
const cors_options = { origin: "localhost" };
const io = require("socket.io")(http, cors_options);
const port = 2022;

app.locals.pluralize = require("pluralize");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(require("ejs-yield"));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(cors_options));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
   session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
   })
);

app.use(csrf());
app.use(passport.authenticate("session"));
app.use(function (req, res, next) {
   var msgs = req.session.messages || [];
   res.locals.messages = msgs;
   res.locals.hasMessages = !!msgs.length;
   req.session.messages = [];
   next();
});

app.use(function (req, res, next) {
   res.locals.csrfToken = req.csrfToken();
   next();
});

require("./app/routes")(app, io);

app.get("*", function (req, res, next) {
   res.layout("error", { title: "404 not found!" });
});

http.listen(port, () => console.log(`App started on port ${port}`));

// const db = require("./app/models");

// db.sequelize.sync({ force: true }).then(() => {
//    console.log("Drop and Resync Db");
//    initial();
// });

// function initial() {
//    const User = db.user;
//    User.create({
//       id: 1,
//       username: "test",
//       email: "test@gmail.com",
//       password: "456463234",
//    });

//    const Post = db.post;
//    Post.create({
//       id: 1,
//       user_id: 1,
//       title: "test",
//       slug: "test",
//       body: "test",
//       image: "",
//       status: 0
//    });
// }

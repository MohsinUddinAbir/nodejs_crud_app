module.exports = function (app, io) {
   require("./auth")(app);
   require("./home")(app);
   require("./user")(app);
   require("./post")(app, io);
};

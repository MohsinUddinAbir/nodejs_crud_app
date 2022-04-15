const config = require("../config/keys");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
   host: config.DB_HOST,
   dialect: config.dialect,
   operatorsAliases: false,
});

(async () => {
   try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
   } catch (error) {
      console.error("Unable to connect to the database:", error);
   }
})();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User")(sequelize, Sequelize);
db.post = require("./Post")(sequelize, Sequelize);
db.friend = require("./Friend")(sequelize, Sequelize);

db.user.belongsToMany(db.user, {
   as: "friend",
   through: "friends",
   otherKey: "fuser_id",
   foreignKey: "user_id",
});

db.user.hasMany(db.post, {
   onDelete: "CASCADE",
   foreignKey: "user_id",
});

db.post.belongsTo(db.user, {
   foreignKey: "user_id",
});

module.exports = db;

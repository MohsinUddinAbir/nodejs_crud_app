module.exports = (sequelize, Sequelize) => {
   const Friend = sequelize.define("friends", {
      user_id: {
         type: Sequelize.INTEGER,
         foreignKey: true,
         references: {
            model: "users",
            key: "id",
         },
      },
      fuser_id: {
         type: Sequelize.INTEGER,
         foreignKey: true,
         references: {
            model: "users",
            key: "id",
         },
      },
   });
   return Friend;
};

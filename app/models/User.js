module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define("users", {
      username: {
         type: Sequelize.STRING,
      },
      email: {
         type: Sequelize.STRING,
      },
      password: {
         type: Sequelize.STRING,
      },
      about: {
         type: Sequelize.STRING,
         defaultValue: "",
      },
      image: {
         type: Sequelize.STRING,
         defaultValue: "",
      },
      visible: {
         type: Sequelize.BOOLEAN,
         defaultValue: true,
      },
      role: {
         type: Sequelize.INTEGER,
         defaultValue: 0,
      },
   });

   return User;
};

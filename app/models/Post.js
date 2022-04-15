module.exports = (sequelize, Sequelize) => {
   const Post = sequelize.define("posts", {
      user_id: {
         type: Sequelize.INTEGER,
         references: {
            model: "users",
            key: "id",
         },
      },
      title: {
         type: Sequelize.STRING,
      },
      slug: {
         type: Sequelize.STRING,
      },
      body: {
         type: Sequelize.TEXT,
      },
      image: {
         type: Sequelize.STRING,
         defaultValue: "",
      },
      status: {
         type: Sequelize.INTEGER,
         defaultValue: 1,
      },
   });
   return Post;
};

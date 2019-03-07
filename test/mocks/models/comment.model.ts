const Sequelize = require('sequelize');

export const defineComment = (connection: any): Object =>  {
  return connection.define('comment', {
    title: {
      type: Sequelize.STRING, allowNull: false,
    },
    commentable_id: Sequelize.INTEGER
  });
};
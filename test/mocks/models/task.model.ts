const Sequelize = require('sequelize');

export const defineTask = (connection: any): Object =>  {
  return connection.define('task', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING, allowNull: false, unique: true,
      validate: {
        notEmpty: true
      }
    },
    completed: {
      type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
    }
  });
};
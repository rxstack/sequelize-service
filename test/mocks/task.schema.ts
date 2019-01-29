import {SequelizeConnection} from '../../src';
const Sequelize = require('sequelize');

export const taskSchema = (connection: SequelizeConnection): Object =>  {
  return connection.define('task', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING, allowNull: false, unique: true
    },
    completed: {
      type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
    }
  });
};
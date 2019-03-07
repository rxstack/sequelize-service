import {SequelizeConnection} from '../../../src';
const Sequelize = require('sequelize');

export const defineComment = (connection: SequelizeConnection): Object =>  {
  return connection.define('comment', {
    title: {
      type: Sequelize.STRING, allowNull: false,
    },
    commentable_id: Sequelize.INTEGER
  });
};
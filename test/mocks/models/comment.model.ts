import {DataTypes, Sequelize} from 'sequelize';
import {ModelStatic} from '../../../src';

export const defineComment = (connection: Sequelize): ModelStatic =>  {
  return <ModelStatic>connection.define('comment', {
    title: {
      type: DataTypes.STRING, allowNull: false,
    },
    commentable_id: DataTypes.INTEGER
  });
};
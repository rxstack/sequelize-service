import {DataTypes, Sequelize} from 'sequelize';
import {ModelStatic} from '../../../src';

export const defineTask = (connection: Sequelize): ModelStatic =>  {
  return <ModelStatic>connection.define('task', {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING, allowNull: false, unique: true,
      validate: {
        notEmpty: true
      }
    },
    completed: {
      type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
    }
  });
};
import {defineTask} from './models/task.model';
import {defineComment} from './models/comment.model';
import { Sequelize} from 'sequelize';
import {ModelStatic} from '../../src';

export const defineModels = (connection: Sequelize): {[key: string]: ModelStatic} =>  {

  const task = defineTask(connection);
  const comment = defineComment(connection);

  comment.belongsTo(task, {
    foreignKey: 'task_id',
    constraints: true,
    as: 'task'
  });

  task.hasMany(comment, {
    foreignKey: 'task_id',
    constraints: false,
    scope: {
      commentable: 'task'
    }
  });

  return {
    task,
    comment
  };
};
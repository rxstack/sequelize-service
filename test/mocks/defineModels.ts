import {defineTask} from './models/task.model';
import {defineComment} from './models/comment.model';

export const defineModels = (connection: any): Object =>  {

  const task: any = defineTask(connection);
  const comment: any = defineComment(connection);

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
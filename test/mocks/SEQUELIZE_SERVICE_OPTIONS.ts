import {ApplicationOptions} from '@rxstack/core';
import {
  SEQUELIZE_CONNECTION_TOKEN,
  SequelizeConnection,
  SequelizePurger, SequelizeService, SequelizeServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Task} from './task';
import {taskSchema} from './task.schema';
import {PURGER_SERVICE} from '@rxstack/data-fixtures';

export const TASK_SERVICE = new InjectionToken<SequelizeService<Task>>('TASK_SERVICE');

export const SEQUELIZE_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [SequelizeServiceModule.configure({
    connection: {
      host: '127.0.0.1',
      database: 'test',
      username: 'root',
      password: 'root',
      dialect: 'mysql',
      define: {
        timestamps: false
      }
    },
  })],
  providers: [
    {
      provide: TASK_SERVICE,
      useFactory: (conn: SequelizeConnection) => {
        return new SequelizeService({ idField: '_id', model: taskSchema(conn) });
      },
      deps: [SEQUELIZE_CONNECTION_TOKEN],
    },
    {
      provide: PURGER_SERVICE,
      useFactory: (conn: SequelizeConnection) => {
        return new SequelizePurger(conn);
      },
      deps: [SEQUELIZE_CONNECTION_TOKEN],
    },
  ],
  logger: {
    handlers: [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
  },
};
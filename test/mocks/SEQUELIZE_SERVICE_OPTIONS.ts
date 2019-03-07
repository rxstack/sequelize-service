process.env.MYSQL_HOST = process.env.MYSQL_HOST || 'mysqldb';
process.env.MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'test';
process.env.MYSQL_USER = process.env.MYSQL_USER || 'root';
process.env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD === undefined ? 'root' : process.env.MYSQL_PASSWORD;

import {ApplicationOptions} from '@rxstack/core';
import {
  SEQUELIZE_CONNECTION_TOKEN,
  SequelizeService, SequelizeServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Task} from './task';
import {defineModels} from './defineModels';

export const MODELS = new InjectionToken<any>('MODELS');
export const TASK_SERVICE = new InjectionToken<SequelizeService<Task>>('TASK_SERVICE');
export const SEQUELIZE_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [SequelizeServiceModule.configure({
    connection: {
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      dialect: 'mysql',
      define: {
        timestamps: false
      }
    },
    logger: {
      enabled: true
    }
  })],
  providers: [
    {
      provide: MODELS,
      useFactory: (conn: any) => defineModels(conn),
      deps: [SEQUELIZE_CONNECTION_TOKEN],
    },
    {
      provide: TASK_SERVICE,
      useFactory: (conn: any, models: any) => {
        return new SequelizeService({ idField: '_id', defaultLimit: 25, model: models['task']});
      },
      deps: [SEQUELIZE_CONNECTION_TOKEN, MODELS],
    }
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
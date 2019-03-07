import {ServiceOptions} from '@rxstack/platform';
import {InjectionToken} from 'injection-js';
import {LoggingLevel} from '@rxstack/core';

export interface SequelizeServiceModuleOptions {
  connection: any;
  logger?: {
    enabled: boolean;
    level?: LoggingLevel;
  };
}

export const SEQUELIZE_CONNECTION_TOKEN = new InjectionToken<any>('SEQUELIZE_CONNECTION_TOKEN');

export interface SequelizeServiceOptions extends ServiceOptions {
  model: any;
}
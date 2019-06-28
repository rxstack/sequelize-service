import {ServiceOptions} from '@rxstack/platform';
import {InjectionToken} from 'injection-js';
import {LoggingLevel} from '@rxstack/core';
import {BuildOptions, Model, Options, Sequelize} from 'sequelize';

export interface SequelizeServiceModuleOptions {
  connection: Options;
  logger?: {
    enabled: boolean;
    level?: LoggingLevel;
  };
}

export const SEQUELIZE_CONNECTION_TOKEN = new InjectionToken<Sequelize>('SEQUELIZE_CONNECTION_TOKEN');

export type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Model;
};

export interface SequelizeServiceOptions extends ServiceOptions {
  model: ModelStatic;
}
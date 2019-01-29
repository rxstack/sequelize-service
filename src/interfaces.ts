import {ServiceOptions} from '@rxstack/platform';
import {InjectionToken} from 'injection-js';

export interface SequelizeServiceModuleOptions {
  connection: any;
}

export interface SequelizeConnection {
  define(name: string, schema: Object, options?: Object): Object;
  authenticate(): Promise<void>;
  close(): Promise<void>;
  sync(): Promise<void>;
  drop(): Promise<void>;
}

export const SEQUELIZE_CONNECTION_TOKEN = new InjectionToken<SequelizeConnection>('SEQUELIZE_CONNECTION_TOKEN');

export interface SequelizeServiceOptions extends ServiceOptions {
  model: any;
}
import {COMMAND_REGISTRY, Module, ModuleWithProviders} from '@rxstack/core';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeConnection, SequelizeServiceModuleOptions} from './interfaces';
import {Provider} from 'injection-js';
import {DropCommand, SyncCommand} from './commands';

const winstonLogger = require('winston');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connectionProvider =  async function(options: SequelizeServiceModuleOptions): Promise<Provider> {
  const connection: SequelizeConnection = new Sequelize(Object.assign(options.connection, {
    operatorsAliases: operators,
    logging: (data: any, benchmark: any) => {
      winstonLogger.log('debug', 'Sequelize:', {query: data, benchmark: benchmark + ' ms'});
    },
    benchmark: true
  }));
  await connection.authenticate();
  return { provide: SEQUELIZE_CONNECTION_TOKEN, useValue: connection};
};

@Module()
export class SequelizeServiceModule {
  static configure(configuration: SequelizeServiceModuleOptions): ModuleWithProviders {
    return {
      module: SequelizeServiceModule,
      providers: [
        connectionProvider(configuration),
        { provide: COMMAND_REGISTRY, useClass: SyncCommand, multi: true },
        { provide: COMMAND_REGISTRY, useClass: DropCommand, multi: true }
      ]
    };
  }
}

const operators = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $in: Op.in,
  $nin: Op.notIn,
  $or: Op.or
};
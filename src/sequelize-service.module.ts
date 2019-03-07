import {COMMAND_REGISTRY, Module, ModuleWithProviders} from '@rxstack/core';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeServiceModuleOptions} from './interfaces';
import {Provider} from 'injection-js';
import {DropCommand, SyncCommand} from './commands';
import {ValidationObserver} from './validation.observer';

const winstonLogger = require('winston');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connectionProvider =  async function(options: SequelizeServiceModuleOptions): Promise<Provider> {
  const connection: any = new Sequelize(Object.assign(options.connection, {
    operatorsAliases: {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $in: Op.in,
      $nin: Op.notIn,
      $or: Op.or
    },
    logging: (data: any, benchmark: any) => {
      if (options.logger.enabled) {
        winstonLogger.log(
          options.logger.level,
          'Sequelize:', {query: data, benchmark: benchmark + ' ms'}
        );
      }
    },
    benchmark: true
  }));
  await connection.authenticate();
  return { provide: SEQUELIZE_CONNECTION_TOKEN, useValue: connection};
};

@Module()
export class SequelizeServiceModule {
  static configure(configuration: SequelizeServiceModuleOptions): ModuleWithProviders {
    configuration.logger = Object.assign({enabled: false, level: 'debug'}, configuration.logger);
    return {
      module: SequelizeServiceModule,
      providers: [
        connectionProvider(configuration),
        { provide: ValidationObserver, useClass: ValidationObserver },
        { provide: COMMAND_REGISTRY, useClass: SyncCommand, multi: true },
        { provide: COMMAND_REGISTRY, useClass: DropCommand, multi: true }
      ]
    };
  }
}
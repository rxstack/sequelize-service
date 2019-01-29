import {Module, ModuleWithProviders} from '@rxstack/core';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeConnection, SequelizeServiceModuleOptions} from './interfaces';
import {Provider} from 'injection-js';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connectionProvider =  async function(options: SequelizeServiceModuleOptions): Promise<Provider> {
  const connection: SequelizeConnection = new Sequelize(Object.assign(options.connection, {
      operatorsAliases: operators
  }));
  await connection.authenticate();
  return { provide: SEQUELIZE_CONNECTION_TOKEN, useValue: connection};
};

@Module()
export class SequelizeServiceModule {
  static configure(configuration: SequelizeServiceModuleOptions): ModuleWithProviders {
    return {
      module: SequelizeServiceModule,
      providers: [connectionProvider(configuration)]
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
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.ilike,
    $notILike: Op.notILike,
    $or: Op.or,
    $and: Op.and
};
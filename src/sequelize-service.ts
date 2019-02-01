import {ServiceInterface} from '@rxstack/platform';
import {QueryInterface} from '@rxstack/query-filter';
import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '@rxstack/core';
import * as _ from 'lodash';
import {SequelizeServiceOptions} from './interfaces';

@Injectable()
export class SequelizeService<T> implements ServiceInterface<T>, InjectorAwareInterface {

  protected injector: Injector;

  constructor(public options: SequelizeServiceOptions) { }

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  async insertOne(data: Object): Promise<T> {
    const result = await this.getModel().create(data);
    return result.get({plain: true});
  }

  async insertMany(data: Object[]): Promise<T[]> {
    const result = await this.getModel().bulkCreate(data);
    return result.map((item: any) => item.get({plain: true}));
  }

  async updateOne(id: any, data: Object): Promise<void> {
    return await this.getModel().update(_.omit(data, [this.options.idField]), {where: {[this.options.idField]: id}});
  }

  async updateMany(criteria: Object, data: Object): Promise<number> {
    const result = await this.getModel().update(_.omit(data, [this.options.idField]), {where: criteria});
    return result.shift();
  }

  async removeOne(id: any): Promise<void> {
    await this.getModel().destroy({where: {[this.options.idField]: id}});
  }

  async removeMany(criteria: Object): Promise<number> {
    return await this.getModel().destroy({where: criteria});
  }

  count(criteria?: Object): Promise<number> {
    return this.getModel().count({ where: criteria });
  }

  async find(id: any): Promise<T> {
    return await this.getModel().findByPk(id);
  }

  async findOne(criteria: Object): Promise<T> {
    return this.getModel().findOne({ where: criteria, raw: true });
  }

  async findMany(query?: QueryInterface): Promise<T[]> {
    query = Object.assign({where: {}, limit: this.options.defaultLimit, skip: 0, sort: {}}, query);
    const sqlQuery = {
      where: query.where, limit: query.limit, offset: query.skip, order: this.getOrder(query.sort), raw: true
    };
    return await this.getModel().findAll(sqlQuery);
  }

  protected getOrder(sort: Object): [string, number][] {
    return Object.keys(sort).reduce((order, name) => {
      order.push([ name, parseInt(sort[name], 10) === 1 ? 'ASC' : 'DESC' ]);
      return order;
    }, []);
  }

  protected getModel(): any {
    return this.options.model;
  }
}
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

  async insertOne(data: Object, options?: any): Promise<T> {
    const result = await this.getModel().create(data, options);
    return result.get({plain: true});
  }

  async insertMany(data: Object[], options?: any): Promise<T[]> {
    const result = await this.getModel().bulkCreate(data, options);
    return result.map((item: any) => item.get({plain: true}));
  }

  async updateOne(id: any, data: Object, options?: any): Promise<void> {
    return await this.getModel().update(
      _.omit(data, [this.options.idField]), Object.assign({where: {[this.options.idField]: id}}, options)
    );
  }

  async updateMany(criteria: Object, data: Object, options?: any): Promise<number> {
    const result = await this.getModel().update(
      _.omit(data, [this.options.idField]),
      Object.assign({where: criteria}, options)
    );
    return parseInt(result.shift());
  }

  async removeOne(id: any, options?: any): Promise<void> {
    await this.getModel().destroy(Object.assign({where: {[this.options.idField]: id}}, options));
  }

  async removeMany(criteria: Object, options?: any): Promise<number> {
    return await this.getModel().destroy(Object.assign({where: criteria}, options));
  }

  count(criteria?: Object, options?: any): Promise<number> {
    return this.getModel().count(Object.assign({ where: criteria }, options));
  }

  async find(id: any, options?: any): Promise<T> {
    return await this.getModel().findByPk(id, options);
  }

  async findOne(criteria: Object, options?: any): Promise<T> {
    return this.getModel().findOne(Object.assign({ where: criteria, raw: true }, options));
  }

  async findMany(query?: QueryInterface, options?: any): Promise<T[]> {
    query = Object.assign({where: {}, limit: this.options.defaultLimit, skip: 0, sort: {}}, query);
    const sqlQuery = Object.assign({
      where: query.where, limit: query.limit, offset: query.skip, order: this.getOrder(query.sort), raw: true
    }, options);
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
import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {SEQUELIZE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/SEQUELIZE_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {data1} from './mocks/data';
import {Task} from './mocks/task';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeService} from '../src';

const Sequelize = require('sequelize');
const Op: any = Sequelize.Op;


describe('SequelizeService:Impl', () => {
  // Setup application
  const app = new Application(SEQUELIZE_SERVICE_OPTIONS);
  let injector: Injector;
  let service: SequelizeService<Task>;
  let conn: any;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    service = injector.get(TASK_SERVICE);
    conn = injector.get(SEQUELIZE_CONNECTION_TOKEN);
  });

  after(async() =>  {
    await app.stop();
  });

  beforeEach(async () => {
    await await conn.sync();
  });

  afterEach(async () => {
    await conn.drop();
  });

  it('#insertOne', async () => {
    const data = data1[0];
    const obj = await service.insertOne(data);
    (typeof obj._id).should.equal('number');
    obj.name.should.be.equal(data.name);
    obj.completed.should.be.equal(false);
  });

  it('#insertOne with transaction', async () => {
    const data = data1[0];
    try {
      await conn.transaction(async (t: any) => {
        await service.insertOne(data, {transaction: t});
        throw new Error('Interrupt transaction');
      });
    } catch (e) { }

    const cnt = await service.count();
    cnt.should.be.equal(0);
  });

  it('#insertMany', async () => {
    await service.insertMany(data1);
    const result = await service.count();
    result.should.be.equal(3);
  });

  it('#updateOne', async () => {
    await service.insertMany(data1);
    await service.updateOne(2, {
      'name': 'replaced'
    });
    const result = await service.find(2);
    result._id.should.be.equal(2);
    result.name.should.be.equal('replaced');
  });

  it('#updateMany', async () => {
    await service.insertMany(data1);
    const cnt = await service.updateMany({'_id': {[Op.eq]: 2}}, {'name': 'patched'});
    cnt.should.be.equal(1);
    const result = await service.find(2);
    result.name.should.be.equal('patched');
  });

  it('#removeOne', async () => {
    await service.insertMany(data1);
    await service.removeOne(1);
    const result = await service.find(1);
    (!!result).should.be.equal(false);
  });

  it('#removeMany', async () => {
    await service.insertMany(data1);
    const result = await service.removeMany({ '_id': {[Op.eq]: 2}});
    result.should.equal(1);
    const cnt = await service.count();
    cnt.should.equal(2);
  });

  it('#findMany', async () => {
    await service.insertMany(data1);
    const result = await service.findMany();
    result.length.should.be.equal(3);
  });

  it('#findMany with query', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {'name': {[Op.eq]: 'task-1'}}, limit: 10, skip: 0});
    result.length.should.be.equal(1);
  });

  it('#findMany with sort desc', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 0, sort: {'name': 1}});
    result[0].name.should.be.equal('task-1');
  });

  it('#findMany with sort asc', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 0, sort: {'name': -1}});
    result[0].name.should.be.equal('task-3');
  });

  it('#findMany with offset', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 1});
    result[0].name.should.be.equal('task-2');
  });

  it('#count', async () => {
    await service.insertMany(data1);
    const result = await service.count();
    result.should.be.equal(3);
  });

  it('#count with query', async () => {
    await service.insertMany(data1);
    const result = await service.count({'name': {[Op.eq]: 'task-1'}});
    result.should.be.equal(1);
  });

  it('#findOne', async () => {
    await service.insertMany(data1);
    const result = await service.findOne({'name': {[Op.eq]: 'task-1'}});
    result.name.should.be.equal('task-1');
  });
});

require('dotenv').config();
import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {SEQUELIZE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/SEQUELIZE_SERVICE_OPTIONS';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeConnection, SequelizeService} from '../src';

describe('SequelizeService:SequelizeServiceModule', () => {
  // Setup application
  const app = new Application(SEQUELIZE_SERVICE_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('#Connection', () => {
    (typeof injector.get(SEQUELIZE_CONNECTION_TOKEN)).should.be.equal('object');
  });

  it('#TASK_SERVICE', () => {
    injector.get(TASK_SERVICE).should.be.instanceOf(SequelizeService);
  });
});

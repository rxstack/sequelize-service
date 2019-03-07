import 'reflect-metadata';
import {Application, ExceptionEvent, Request} from '@rxstack/core';
import {SEQUELIZE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/SEQUELIZE_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {Task} from './mocks/task';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeService, ValidationObserver} from '../src';
import * as _ from 'lodash';
import {Exception, transformToException} from '@rxstack/exceptions';

describe('SequelizeService:ValidationObserver', () => {
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

  it('#should throw BadRequestException', async () => {
    let exception: Exception;
    try {
      await service.insertOne({'name': ''});
    } catch (e) {
      exception = transformToException(e);
    }

    const request = new Request('HTTP');
    const event = new ExceptionEvent(exception,  request);
    const observer = injector.get(ValidationObserver);

    try {
      await observer.onException(event);
    } catch (e) {
      _.isEqual(e.data['errors'],
        [ { path: 'name', value: '', message: 'Validation notEmpty on name failed' } ]).should.be.equal(true);
    }
  });
});


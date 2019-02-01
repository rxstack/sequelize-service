import 'reflect-metadata';
import {Application, CommandManager} from '@rxstack/core';
import {SEQUELIZE_SERVICE_OPTIONS} from './mocks/SEQUELIZE_SERVICE_OPTIONS';
import {SEQUELIZE_CONNECTION_TOKEN, SequelizeConnection} from '../src';

describe('Console:Commands', () => {
  // Setup application
  const app = new Application(SEQUELIZE_SERVICE_OPTIONS);
  let conn: SequelizeConnection;

  before(async () => {
    await app.start();
    conn = app.getInjector().get(SEQUELIZE_CONNECTION_TOKEN);
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await conn.drop();
  });

  it('should sync database', async () => {
    const command = app.getInjector().get(CommandManager).getCommand('sequelize:sync');
    await command.handler({});
    const result = await conn.query('show tables like "tasks"', {raw: true});
    result[0].length.should.be.equal(1);
  });

  it('should drop database', async () => {
    await conn.sync();
    const command = app.getInjector().get(CommandManager).getCommand('sequelize:drop');
    await command.handler({});
    const result = await conn.query('show tables like "tasks"', {raw: true});
    result[0].length.should.be.equal(0);
  });
});


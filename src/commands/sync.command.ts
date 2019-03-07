import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';
import {SEQUELIZE_CONNECTION_TOKEN} from '../interfaces';

const chalk = require('chalk');

@Injectable()
export class SyncCommand extends AbstractCommand {
  command = 'sequelize:sync';
  describe = 'Sync all defined models to the DB.';

  builder = (yargs: any) => {
    yargs.option('f', {
      describe: 'If force is true, each Model will run DROP TABLE IF EXISTS, before it tries to create its own table',
      default: false,
      type: 'boolean',
      alias: 'force',
    });
  }

  async handler(argv: any): Promise<void> {
    console.log(chalk.blue('Synchronizing database ...'));
    const force = argv.force ? true : false;
    await this.injector.get(SEQUELIZE_CONNECTION_TOKEN).sync({force: force});
    console.log(chalk.green('Synchronization completed.'));
  }
}
import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';
import {SEQUELIZE_CONNECTION_TOKEN} from '../interfaces';

const chalk = require('chalk');

@Injectable()
export class SyncCommand extends AbstractCommand {
  command = 'sequelize:sync';
  describe = 'Sync all defined models to the DB.';

  async handler(argv: any): Promise<void> {
    console.log(chalk.blue('Synchronizing database ...'));
    await this.injector.get(SEQUELIZE_CONNECTION_TOKEN).sync(argv);
    console.log(chalk.green('Synchronization completed.'));
  }
}
import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';
import {SEQUELIZE_CONNECTION_TOKEN} from '../interfaces';

const chalk = require('chalk');

@Injectable()
export class DropCommand extends AbstractCommand {
  command = 'sequelize:drop';
  describe = 'Drop all tables.';

  async handler(argv: any): Promise<void> {
    console.log(chalk.blue('Dropping database ...'));
    await this.injector.get(SEQUELIZE_CONNECTION_TOKEN).drop();
    console.log(chalk.green('Dropping completed.'));
  }
}
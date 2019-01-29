import {Injectable} from 'injection-js';
import {PurgerInterface} from '@rxstack/data-fixtures';
import {SequelizeConnection} from './interfaces';

@Injectable()
export class SequelizePurger implements PurgerInterface {

  constructor(private conn: SequelizeConnection) { }

  async purge(): Promise<void> {
    await this.conn.drop();
  }
}
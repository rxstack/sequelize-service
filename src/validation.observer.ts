import {Injectable} from 'injection-js';
import {KernelEvents, ExceptionEvent} from '@rxstack/core';
import {Observe} from '@rxstack/async-event-dispatcher';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';

@Injectable()
export class ValidationObserver {
  @Observe(KernelEvents.KERNEL_EXCEPTION)
  async onException(event: ExceptionEvent): Promise<void> {
    if (event.getException().name === 'SequelizeValidationError'
      && typeof event.getException().originalError['errors'] !== 'undefined') {
      const exception = new BadRequestException('Validation Failed');
      exception.data = { errors: [] };
      _.forEach(event.getException().originalError['errors'], (v: any) => {
        exception.data.errors.push({
          path: v.path,
          value: v.value,
          message: v.message
        });
      });
      throw exception;
    }
  }
}
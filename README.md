# The RxStack Sequelize Service

[![Build Status](https://travis-ci.org/rxstack/sequelize-service.svg?branch=master)](https://travis-ci.org/rxstack/sequelize-service)
[![Maintainability](https://api.codeclimate.com/v1/badges/0605416059f00234dbc3/maintainability)](https://codeclimate.com/github/rxstack/sequelize-service/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0605416059f00234dbc3/test_coverage)](https://codeclimate.com/github/rxstack/sequelize-service/test_coverage)

> Sequelize service that implements [@rxstack/platform adapter API and querying syntax](https://github.com/rxstack/rxstack/tree/master/packages/platform#services).

## Table of content

- [Installation](#installation)
- [Setup](#setup)
- [Module Options](#module-options)
- [Service Options](#service-options)
- [Usage](#usage)
    - [Create interfaces](#usage-interfaces)
    - [Create sequelize models](#usage-models)
    - [How to use in controller](#usage-controller)
- [Commands](#commands)
    - [Sync](#commands-sync)
    - [Drop](#commands-drop)
- [Validation Observer](#validation-observer)

## Installation

```
npm install @rxstack/sequelize-service --save

// peer depencencies
npm install  @rxstack/core@^0.1 @rxstack/platform@^0.1.10 @rxstack/exceptions@^0.1 @rxstack/query-filter@^0.1 @rxstack/security@^0.1 
```

and add one of the following:

```bash
npm install --save pg pg-hstore
npm install --save mysql2 // For both mysql and mariadb dialects
npm install --save sqlite3
npm install --save tedious // MSSQL
```

[Read sequelize docs](http://docs.sequelizejs.com/)

## <a name="setup"></a>  Setup
`SequelizeServiceModule` needs to be registered in the `application`. Let's create the application:

> In the example we are using `mysql`.

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import {SequelizeServiceModule} from '@rxstack/sequilize-service';

export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    SequelizeServiceModule.configure({
      connection: {
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        dialect: 'mysql',
        define: {
          timestamps: false
        }
      },
      logger: {
        enabled: true
      }
    })
  ],
  providers: [
    // ...
  ],
  logger: {
    // ...
  }
};

new Application(APP_OPTIONS).start();
```

## <a name="module-options"></a> Module Options

- `connection`: [sequelize options](http://docs.sequelizejs.com/manual/installation/getting-started.html)
- `logger.enabled`: enable query logging (defaults to false)
- `logger.level`: logging level (defaults to debug), [LoggingLevel](https://github.com/rxstack/rxstack/blob/master/packages/core/src/logger/interfaces.ts#L3)

## <a name="service-options"></a> Service Options
In addition to [service base options](https://github.com/rxstack/rxstack/tree/preparing-release/packages/platform#services-options)
we need to set the following options:

- `model`: [sequelize model](http://docs.sequelizejs.com/manual/tutorial/models-definition.html)

## <a name="usage"></a>  Usage

### <a name="usage-interfaces"></a> Create interfaces
First we need to create `model interface` and `InjectionToken`:

```typescript
import {InjectionToken} from 'injection-js';
import {SequelizeService} from '@rxstack/sequelize-service';

export interface Product {
  id: string;
  name: string;
}

export const PRODUCT_SERVICE = new InjectionToken<SequelizeService<Product>>('PRODUCT_SERVICE');
```

### <a name="usage-models"></a> Create sequelize models


```typescript
const Sequelize = require('sequelize');

export const defineProduct = (connection: any): Object =>  {
  return connection.define('product', {
    _id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING, allowNull: false, unique: true,
      validate: {
        notEmpty: true
      }
    }
  });
};
```

define all models in a singe function (useful to set associations) :

```typescript
import {defineProduct} from './product.schema';

export const defineModels = (connection: any): Object =>  {

  const product: any = defineProduct(connection);
  // define other models here
  // ...
  // define associations here

  return {
    product
    // ...
  };
};
```

then register the service and models in the application provides:

```typescript
import {InjectionToken} from 'injection-js';
import {ApplicationOptions} from '@rxstack/core';
import {SequelizeService} from '@rxstack/sequelize-service';
import {SEQUELIZE_CONNECTION_TOKEN} from '@rxstack/sequelize-service'

export const SEQUELIZE_MODELS = new InjectionToken<any>('SEQUELIZE_MODELS'); 

export const APP_OPTIONS: ApplicationOptions = {
  // ...
  providers: [
    {
      provide: SEQUELIZE_MODELS,
      useFactory: (conn: any) => defineModels(conn),
      deps: [SEQUELIZE_CONNECTION_TOKEN],
    },
    {
      provide: PRODUCT_SERVICE,
      useFactory: (conn: any, models: any) => {
        return new SequelizeService({
          idField: '_id', defaultLimit: 25, model: models.task
        });
      },
      deps: [SEQUELIZE_CONNECTION_TOKEN, SEQUELIZE_MODELS],
    },
  ]
};
```

### <a name="usage-controller"></a> How to use in controller

```typescript
import {Injectable} from 'injection-js';
import {Http, Logger, Request, Response, WebSocket, InjectorAwareInterface} from '@rxstack/core';

@Injectable()
export class ProductController implements InjectorAwareInterface {

  @Http('POST', '/product', 'app_product_create')
  @WebSocket('app_product_create')
  async createAction(request: Request): Promise<Response> {
    // getting connection
    const conn = this.injector.get(SEQUELIZE_CONNECTION_TOKEN);
    const service = this.injector.get(PRODUCT_SERVICE);
    
    // standard use
    await service.insertOne(request.body);
    
    // with transaction and sequelize model options
    await conn.transaction(async (t: any) => {
      await service.insertOne(request.body, {transaction: t});
      await anotherService.insertOne(request.body, {transaction: t});
    });
  }
}
```

## <a name="commands"></a>  Commands
Helpful commands managing your sequelize database

### <a name="commands-sync"></a> Sync
Sync all defined models to the DB. [More info](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-sync)

```bash
npm run cli sequelize:sync
```

with "force" option, defaults to false

```bash
npm run cli sequelize:sync -- -f
```

### <a name="commands-drop"></a> Drop
Drop all tables. [More info](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-drop)

```bash
npm run cli sequelize:drop
```

## <a name="validation-observer"></a>  Validation Observer
`ValidationObserver` converts sequelize errors to `BadRequestException`.

In order to return proper validation errors and status code `400 ` we catch the exception and throw `BadRequestException`.
The error messages can be accessed `exception.data['errors']` and implement [`ValidationError[]`](https://github.com/rxstack/rxstack/tree/master/packages/platform/src).

## License

Licensed under the [MIT license](LICENSE).


import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import * as session from 'express-session';
import * as passport from 'passport';

import { authRoutes, guard } from './auth/index';
import { studentRoutes } from './students/student.router';
import { groupRoutes } from './groups/group.router';
import { staffRoutes } from './staff/staff.router';
import { roleRoutes } from './roles/role.router';
import { kivaRoutes } from './kiva/kiva.router';
import { libraryRoutes } from './library/library.router';
import { JSONError } from './shared/jsonerror';
import { validateRequest } from './shared/validate.request';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.mongo();
        this.routes();
    }

    private middleware(): void {
        //logging
        this.express.use(logger('dev'));
        //bodyParser
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        //handle errors
        this.express.use(this.errorHandler);

        //this.express.all('/v1/*', validateRequest);
    }

    private mongo() {
        let uri = 'mongodb://localhost/mykt-test';
        mongoose.connect(uri, (err) => {
            if (err) {
                console.log(err.message);
                console.log(err);
            } else {
                console.log('Connected to MongoDB');
            }
        });
        (mongoose as any).Promise = global.Promise;
        bluebird.promisifyAll(mongoose);
    }

    private routes(): void {
        this.express.use('/login', authRoutes.router);
        this.express.use('/v1/students', studentRoutes.router);
        this.express.use('/v1/groups', groupRoutes.router);
        this.express.use('/v1/staff', staffRoutes.router);
        this.express.use('/v1/roles', roleRoutes.router);
        this.express.use('/v1/kiva', kivaRoutes.router);
        this.express.use('/v1/library', libraryRoutes.router);
    }

    private errorHandler(err, req, res, next) {
        if (err instanceof JSONError) {
            res.status(err.status)
                .json({
                    status: err.status,
                    message: err.message,
                    errors: err.errors
                });
        } else {
            res.status(500).send(err.message);
        }
    }
}


export default new App().express;

import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { auth, guard } from '../auth/index';
import { JSONError } from '../shared/jsonerror';

export class AuthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }
    get(req: Request, res: Response) {
        res.json({test: 'ok'});
    }
    login(req: Request, res: Response, next: NextFunction) {
        var password = req.body.password || ''; 
        var username = req.body.username || '';

        return auth.login(username, password) 
            .then(token => {
                res.status(200).json(token);
            }).catch(err => {
                next(err);
            });
    }


    init() {
        this.router.get('/', this.get);
        this.router.post('/', this.login);
    }
}

export const authRoutes = new AuthRouter();
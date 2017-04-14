import { Router, Request, Response, NextFunction } from 'express';

export class AuthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    login() {

    }

    init() {
        this.router.post('/', this.login);
    }
}

export const authRoutes = new AuthRouter();
import * as jwt from 'jwt-simple';
import { Router, Request, Response, NextFunction } from 'express';
import { staffService } from '../staff/index';
import { SECRET } from './secret';

export function validateRequest(req: Request, res: Response, next: NextFunction): void {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    let key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token || key) {
        try {
            let decoded = jwt.decode(token, SECRET);

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    status: 400,
                    message: 'Token expired'
                });
                return;
            }

            //authorize the user to see if s/he can access our resources
            staffService.findUserByUsername(key) //this get the roles too
                .then(user => {
                    //@todo: authorize users here
                    next();
                    //if not
                    /*
                    res.status(403).json('Not authorized');
                    */
                }).catch(err => {
                    res.status(401)
                        .json('invalid user');
                    return;
                });

        } catch (err) {

        }
    } else {
        res.status(401).json('Invalid token or key');
    }
}
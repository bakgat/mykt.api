import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';
import { SECRET } from '../shared/secret';
import { JSONError } from '../shared/jsonerror';

export function guard(options: any) {
    return function (req: Request, res: Response, next: NextFunction) {

        if (typeof options === 'string') {
            options = [options];

            options.forEach(o => {
                var opts = o.split(':');
                if (opts.length > 1 && options.indexOf(opts[0]) == -1) {
                    options.push(opts[0]);
                }
            });
        }

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
                    next(new JSONError('Token expired', 400));
                    return;
                }
                if (decoded.permissions) {
                    let permitted = options.some(v => { return decoded.permissions.indexOf(v) > -1; });
                    if (permitted) {
                        next();
                        return;
                    } else {
                        next(new JSONError(403));
                        return;
                    }
                }

            } catch (err) {
                next(new JSONError(err));
                return;
            }
        } else {
            next(new JSONError('Invalid token or key', 401));
            return;
        }

        next();
    }
}
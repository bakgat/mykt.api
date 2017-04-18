import * as jwt from 'jwt-simple';
import { JSONError } from '../shared/jsonerror';
import { SECRET } from '../shared/secret';
import { staffService, IStaff } from '../staff/index';

export class Auth {
    login(username: string, password: string): Promise<any> {
        let promise = new Promise<any>((resolve, reject) => {
            staffService.findUserByUsername(username)
                .then(user => {
                    if (user.validPassword(password)) {
                        this._genToken(user)
                            .then(token => {
                                resolve(token);
                            });
                    } else {
                        reject(new JSONError(401));
                    }
                })
                .catch(err => {
                    reject(new JSONError(401));
                });
        });

        return promise;
    }

    private _genToken(user: IStaff): Promise<any> {
        let promise = new Promise<any>((resolve, reject) => {
            let expires = this._expiresIn(1);

            staffService.findPermissionsForUser(user.username)
                .then(permissions => {
                    let token = jwt.encode({
                        exp: expires,
                        permissions: permissions,
                        user: user.username
                    }, SECRET);
                    resolve({
                        token: token,
                        expires: expires,
                        user: user.username
                    });
                }).catch(err => reject(err));

        });

        return promise;
    }

    private _expiresIn(numDays) {
        var d = new Date();
        return d.setDate(d.getDate() + numDays);
    }
}

export const auth = new Auth();
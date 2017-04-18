import * as mongoose from 'mongoose';
import { Staff, IStaff } from './staff';
import { IRole, Role } from '../roles/role';
import { roleService } from '../roles/role.service';
import { GenericCrudService } from '../shared/crud.service';

export class StaffService extends GenericCrudService<IStaff> {
    constructor() {
        super();
        this._model = Staff;
        this._select = '-groups';
    }

    findByUsername(username: string): Promise<IStaff> {
        return Staff.findOne({ username: username })
            .exec();
    }
    findUserByUsername(username: string): Promise<IStaff> {
        this._select = '';
        return Staff.findOne({ username: username })
            .exec();
    }

    findPermissionsForUser(username: string): Promise<Array<String>> {
        var permissions: Array<String> = [];
        let promise = new Promise<Array<String>>((resolve, reject) => {
            Staff.findOne({ username: username })
                .then(user => {
                    Role.aggregate(
                        { $match: { name: { $in: user.roles } } },
                        { $unwind: "$permissions" },
                        { $group: { _id: null, perms: { $addToSet: "$permissions" } } },
                        { $project: { _id: 0, permissions: '$perms' } }
                    ).exec()
                        .then(result => {
                            if (result.length == 1) {
                                resolve(result[0].permissions);
                            } else {
                                resolve(null);
                            }
                        })
                        .catch(err => { reject(err); });
                }).catch(err => { reject(err); });
        });
        return promise;
    }

    getRoles(id: string): Promise<Array<IRole>> {
        return Staff.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            { $unwind: '$roles' },
            {
                $project: {
                    _id: '$roles._id',
                    name: '$roles.name'
                }
            }
        ]).exec();
    }

    addToRole(id: string, role: string): Promise<IRole> {
        let promise = new Promise<IRole>((resolve, reject) => {
            roleService.find(role)
                .then(r => {
                    this.getOne(id)
                        .then(staff => {
                            staff.roles.push(r.name);
                            staff.save()
                                .then(result => { resolve(r); })
                                .catch(err => { reject(err); });
                        }).catch(err => { reject(err); });
                }).catch(err => { reject(err); });
        });
        return promise;
    }

    removeRole(id: string, role: string): Promise<IStaff> {
        return Staff.findByIdAndUpdate(id,
            { $pull: { roles: role } })
            .exec();
    }
}

export const staffService = new StaffService();
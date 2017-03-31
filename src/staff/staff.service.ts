import * as mongoose from 'mongoose';
import { Staff, IStaff } from './staff';
import {  IRole } from '../roles/role';
import { GenericCrudService } from '../shared/crud.service';

export class StaffService extends GenericCrudService<IStaff> {
    constructor() {
        super();
        this._model = Staff;
        this._select = '-groups';
    }

    getRoles(id: string): Promise<IRole> {
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
}

export const staffService = new StaffService();
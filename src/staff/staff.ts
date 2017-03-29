import * as mongoose from 'mongoose';
import { IGroup, IStaffGroup } from '../groups/group';
import { gender } from '../abstract/person.types';

export interface IStaff extends mongoose.Document {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    gender: gender;
    /*birthday: Date;
    groups: Array<IStaffGroup>;
    roles: Array<String>;*/
}

export const StaffSchema = new mongoose.Schema({
    id: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: Date, required: false },
    groups: [{
        group_id: { type: mongoose.Schema.Types.String, ref: "Group" },
        name: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: String, required: false },
        type: { type: String, required: true }
    }],
    roles: [{ type: String }]
},
{ collection: 'staff' });

var _model = mongoose.model<IStaff>('staff', StaffSchema);
export const Staff = _model;
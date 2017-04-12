import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IGroup, IStaffGroup } from '../groups/group';
import { IRole } from '../roles/role';
import { gender } from '../shared/person.types';
import { IGooglePassport } from '../shared/google.passport';

export interface IStaff extends mongoose.Document {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    gender: gender;
    password: string;
    google: IGooglePassport,
    roles: Array<string>,
    validPassword,
    generateHash: string
    /*birthday: Date;
    groups: Array<IStaffGroup>;
    ;*/
}

export const StaffSchema = new mongoose.Schema({
    id: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: Date, required: false },
    google: { type: Object, required: false },
    password: { type: String, required: false },
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


StaffSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
StaffSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var _model = mongoose.model<IStaff>('staff', StaffSchema);
export const Staff = _model;

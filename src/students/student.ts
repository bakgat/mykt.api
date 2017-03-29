import * as mongoose from 'mongoose';
import { IGroup, IStudentGroup } from '../groups/group';

export interface IStudent extends mongoose.Document {
    _id: string;
    id: string;
    first_name: string;
    last_name: string;
    school_id: string;
    birthday: Date;
    groups: Array<IStudentGroup>;
}


export const StudentSchema = new mongoose.Schema({
    id: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: true },
    school_id: { type: String, required: false },
    birthday: { type: Date, required: false },
    groups: [{
        group_id: { type: mongoose.Schema.Types.String, ref: "Group" },
        name: String,
        start: Date,
        end: Date
    }]
});

var _model = mongoose.model<IStudent>('students', StudentSchema);
export const Student = _model;
import * as mongoose from 'mongoose';


export interface IGroup extends mongoose.Document {
    _id: string;
    id: string;
    name: string;
    level: string;
}
export interface IStudentGroup {
    _id: mongoose.Types.ObjectId;
    group_id: string;
    name: string;
    start: Date;
    end: Date;
}



export const GroupSchema = new mongoose.Schema({
    id: { type: String, required: false },
    name: { type: String, required: true },
    level: { type: String, required: false }
});

var _model = mongoose.model<IGroup>('groups', GroupSchema);
export const Group = _model;
import * as mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
    name: string
}

export const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

var _model = mongoose.model<IRole>('roles', RoleSchema);
export const Role = _model;
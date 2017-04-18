import * as mongoose from 'mongoose';
import { IStudent } from '../students/student';

export interface IKivaFile extends mongoose.Document {
    _id: string;
    first_entry: {
        date: Date,
        victim: IStudent
    }
}

export const KiveFileSchema = new mongoose.Schema({
    first_entry: {
        date: { type: Date, required: true },
        victim: { type: String, required: true } //@TODO: victim: id, displayname, ...
    }
});

var _model = mongoose.model<IKivaFile>('kiva-files', KiveFileSchema);
export const KivaFile = _model;

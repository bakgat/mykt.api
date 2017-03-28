import * as mongoose from 'mongoose';

export type gender = 'M' | 'F' | 'O';
export interface IStaff extends mongoose.Document {
    _id: string,
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    gender: gender,
    birthday: Date
}

export const StaffSchema = new mongoose.Schema({
    id: { type: String, required: false },
    
    first_name: { type: String, required: false },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: Date, required: false }
});
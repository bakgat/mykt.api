import * as mongoose from 'mongoose';
import { IStudent } from '../students/student';

export interface IKivaStudent extends mongoose.Types.Subdocument {
    _id: String,
    display_name: String,
    group: String
}
export interface IKivaFollowUp extends mongoose.Types.Subdocument {
    _id: string,
    type: String, //enum (contact_teacher, contact_parents, feedback=)
    date: Date,
    conclusion: String
}
export interface IKivaFirstEntry extends mongoose.Types.Subdocument {
    date: Date,
    entry_by: {
        _id: String,
        display_name: String
    },
    victim: IKivaStudent,
    announcer: {
        _id: String,
        display_name: String,
        type: String
    },
    summary: String,
    estimated_times: String,
    last_bully_date: Date,
    bully_timespan: String,
    bullies: mongoose.Types.Array<IKivaStudent>,
    conclusion: String
}
export interface IKivaAgreement extends mongoose.Types.Subdocument {
    _id: String,
    display_name: String,
    group: String,
    agreement: String
}
export interface IKivaAction extends mongoose.Types.Subdocument {
    _id: string,
    type: String, // enum(mini-no-blame, no-blame, recover-contract, thermometer)
    no_blame: {
        date: Date,
        students: mongoose.Types.Array<IKivaAgreement>,
        description: String
    },
    recovery_contract: {
        date: Date,
        students: mongoose.Types.Array<IKivaAgreement>,
        description: String
    },
    thermometer: {
        date: Date,
        conclusion: String
    },
    conclusion: String

}
export interface IKivaVictimInterview extends mongoose.Types.Subdocument {
    victim: IKivaStudent,
    date: Date,
    bully_ways: [String],
    estimated_times: String,
    last_bully_date: Date,
    bully_timespan: String,
    bullies: mongoose.Types.Array<IKivaStudent>,
    supporters: mongoose.Types.Array<IKivaStudent>,
    description: String
}
export interface IKivaFile extends mongoose.Document {
    _id: string;
    first_entry: IKivaFirstEntry,
    victim_interview: IKivaVictimInterview,
    actions: mongoose.Types.Array<IKivaAction>,
    follow_ups: mongoose.Types.Array<IKivaFollowUp>,
    evaluations: mongoose.Types.Array<IKivaFollowUp>,
    locked: {
        date: Date,
        conclusion: String
    }
}

export const KivaStudentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    display_name: { type: String, required: true },
    group: { type: String, required: true }
});
export const KivaFollowUpSchema = new mongoose.Schema({
    date: { type: Date, required: false },
    type: { type: String, required: false },
    conclusion: { type: String, required: false }
});
export const KivaFirstEntrySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    victim: KivaStudentSchema,
    announcer: {
        type: { type: String, required: true },
        _id: { type: String, required: false },
        display_name: { type: String, required: true }
    },
    summary: { type: String, required: false },
    estimated_times: { type: String, required: false },
    last_bully_date: { type: Date, required: false },
    bully_timespan: { type: String, required: false },
    bullies: [KivaStudentSchema],
    conclusion: { type: String, required: false }
});
export const KivaAgreementSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    display_name: { type: String, required: false },
    group: { type: String, required: false },
    agreement: { type: String, required: false },
});
export const KivaActionSchema = new mongoose.Schema({
    type: { type: String, required: false },
    no_blame: {
        date: { type: Date, required: false },
        students: [KivaAgreementSchema],
        description: { type: String, required: false },
    },
    recovery_contract: {
        date: { type: Date, required: false },
        students: [KivaAgreementSchema],
        description: { type: String, required: false },
    },
    thermometer: {
        date: { type: Date, required: false },
        conclusion: { type: String, required: false }
    },
    conclusion: { type: String, required: false }
});
export const KivaVictimInterviewSchema = new mongoose.Schema({
    victim: KivaStudentSchema,
    date: { type: Date, required: false },
    bully_ways: [{ type: String, required: false }],
    estimated_times: { type: String, required: false },
    last_bully_date: { type: Date, required: false },
    bully_timespan: { type: String, required: false },
    bullies: [KivaStudentSchema],
    supporters: [KivaStudentSchema],
    description: { type: String, required: false },
});
export const KiveFileSchema = new mongoose.Schema({
    first_entry: KivaFirstEntrySchema,
    victim_interview: KivaVictimInterviewSchema,
    actions: [KivaActionSchema],
    follow_ups: [KivaFollowUpSchema],
    evaluations: [KivaFollowUpSchema],
    locked: {
        date: { type: Date, required: false },
        conclusion: { type: String, required: false }
    }
});

var _model = mongoose.model<IKivaFile>('kivafiles', KiveFileSchema);
export const KivaFile = _model;

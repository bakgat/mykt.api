import { GenericCrudService } from '../shared/crud.service';
import * as kiva from './kiva.file';

export class KivaService extends GenericCrudService<kiva.IKivaFile> {
    constructor() {
        super();
        this._model = kiva.KivaFile;
    }

    /**
     * Very specific service actions
     * This document will grow over time in some steps
     * 1. Add a first entry, this form is required to start
     * 2. Add a victim_interview, always the second step and required.
     * 3. Determine an action. Can be one of
     *      a. mini-no-blame (saved in no-blame, with only one student)
     *      b. no-blame (supporters and bulliers)
     *      c. recovery_contract (confrontal)( one or multiple bullies)
     *      d. thermometer: only conclusions saved
     * 
     * 4. Follow-ups. Array of objects that can be one of:
     *      a. Contact: teacher, parent, extern
     *      b. Feedback: with victim
     *      c. Feedback: with students (supporters / bullies)
     *     Each contains a conclusion
     * 5. Evaluation: Array of date and coclusions.
     * 6. Lock: if KivaFile is considered done.
     * 
     * To consider:
     *  - who has permissions to save/update/remove
     *  - who has permissions to read each file
     */

    getAllByStudent(id: String): Promise<Array<kiva.IKivaFile>> {
        return null;
    }
    getAllByGroup(id: String): Promise<Array<kiva.IKivaFile>> {
        return null;
    }

    getOne(id: String): Promise<kiva.IKivaFile> {
        return kiva.KivaFile.findById(id).exec();
    }

    addFile(data: kiva.IKivaFirstEntry): Promise<kiva.IKivaFile> {
        var file = new kiva.KivaFile({ first_entry: data });
        return file.save();
    }
    addVictimInterview(id: string, data: kiva.IKivaVictimInterview): Promise<kiva.IKivaVictimInterview> {
        //only one interview possible
        //so add = update ($set ...)
        return this.updateVictimInterview(id, data);
    }
    addAction(id: string, data: kiva.IKivaAction): Promise<kiva.IKivaAction> {
        let promise = new Promise<kiva.IKivaAction>((resolve, reject) => {
            kiva.KivaFile.findById(id)
                .then(file => {
                    file.actions.push(data);
                    file.save()
                        .then((res: kiva.IKivaFile) => {
                            let action = res.actions[res.actions.length - 1];
                            resolve(action);
                        })
                        .catch(err => reject(err));
                }).catch(err => {
                    reject(404);
                });

        });
        return promise;
    }
    addFollowup(data: kiva.IKivaFollowUp): Promise<kiva.IKivaFollowUp> {
        return null;
    }
    addEvaluation(data: kiva.IKivaFollowUp): Promise<kiva.IKivaFollowUp> {
        return null;
    }

    lock(id: any, shouldLock: Boolean): Promise<Boolean> {
        return null;
    }

    updateFile(id: any, data: kiva.IKivaFirstEntry): Promise<kiva.IKivaFile> {
        return kiva.KivaFile.findByIdAndUpdate(id, { first_entry: data }, { new: true }).exec();
    }
    updateVictimInterview(id: any, data: kiva.IKivaVictimInterview): Promise<kiva.IKivaVictimInterview> {
        let promise = new Promise<kiva.IKivaVictimInterview>((resolve, reject) => {
            kiva.KivaFile.findOneAndUpdate({ _id: id }, { $set: { victim_interview: data } }, { new: true })
                .then(res => {
                    if (!res) {
                        reject(404);
                    }
                    resolve(res.victim_interview);
                }).catch(err => {
                    reject(err)
                });
        });
        return promise;
    }
    updateAction(id: any, aid: any, data: kiva.IKivaAction): Promise<kiva.IKivaAction> {
        let promise = new Promise<kiva.IKivaAction>((resolve, reject) => {
            kiva.KivaFile.findOneAndUpdate({ _id: id, 'actions._id': aid },
                { $set: { 'actions.$': data } }, { new: true })
                .then(res => {
                    if (!res) {
                        reject(404);
                    }
                    resolve(res.actions.find(a => { return a._id = aid }));
                }).catch(err => {
                    reject(err);
                });
        });
        return promise;
    }
    updateFollowup(id: any, fid: any, data: kiva.IKivaFollowUp): Promise<kiva.IKivaFollowUp> {
        return null;
    }
    updateEvaluation(id: any, eid: any, data: kiva.IKivaFollowUp): Promise<kiva.IKivaFollowUp> {
        return null;
    }

    removeFile(id: any): Promise<kiva.IKivaFirstEntry> {
        return null;
    }
    removeVictimInterview(id: any, vid: any): Promise<kiva.IKivaVictimInterview> {
        return null;
    }
    removeAction(id: any, aid: any): Promise<kiva.IKivaAction> {
        return null;
    }
    removeFollowup(id: any, fid: any): Promise<kiva.IKivaFollowUp> {
        return null;
    }
    removeEvaluation(id: any, eid: any): Promise<kiva.IKivaFollowUp> {
        return null;
    }
}


export const kivaService = new KivaService();
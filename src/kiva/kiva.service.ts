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
        let promise = new Promise<kiva.IKivaVictimInterview>((resolve, reject) => {
            kiva.KivaFile.findById(id)
                .then(file => {
                    if (file.victim_interview && file.victim_interview._id) {
                        //if already exists, reject
                        reject(409); //let JSONError handle this 409 status code
                    }

                    file.victim_interview = data;
                    file.save()
                        .then((res: kiva.IKivaFile) => {
                            resolve(res.victim_interview);
                        })
                        .catch(err => reject(err));

                }).catch(err => {
                    reject(err);
                });
            var file =
                kiva.KivaFile.findByIdAndUpdate(id, {
                    victim_interview: data
                }, { new: true })
                    .then(result => {
                        resolve(result.victim_interview);
                    }).catch(err => {
                        reject(err);
                    });
        });
        return promise;
    }
    addAction(data: kiva.IKivaAction): Promise<kiva.IKivaAction> {
        return null;
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

    updateFile(id: any, data: kiva.IKivaFirstEntry): Promise<kiva.IKivaFirstEntry> {
        return null;
    }
    updateVictimInterview(id: any, vid: any, data: kiva.IKivaVictimInterview): Promise<kiva.IKivaVictimInterview> {
        return null;
    }
    updateAction(id: any, aid: any, data: kiva.IKivaAction): Promise<kiva.IKivaAction> {
        return null;
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
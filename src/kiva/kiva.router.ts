/*
- how does REST look like
     * 
     * GET /v1/student/:id/kiva => kiva-files where student is part of (victim, supporter or bully)
     * GET /v1/group/:id/kiva => kiva-files where students are part of
     * GET /v1/kiva/:id => get an entire kiva file
     * 
     * 
     * POST /v1/kiva => start new kiva file
     * POST /v1/kiva/:id/victim => add victim interview
     * POST /v1/kiva/:id/actions => add kiva action
     * POST /v1/kiva/:id/followups => add kiva followup
     * POST /v1/kiva/:id/evaluations => add kiva evaluation
     * 
     * PUT /v1/kiva/:id/lock => send lock:true or lock:false + date to lock or unlock file
     * 
     * PUT /v1/kiva/:id => update first entry
     * PUT /v1/kiva/:id/victim => update an victim interview
     * PUT /v1/kiva/:id/actions/:aid => update an action 
     * PUT /v1/kiva/:id/followups/:fid => update a followup
     * PUT /v1/kiva/:id/evaluations/:eid => update en evaluation
     * 
     * DELETE /v1/kiva/:id => remove entire kiva file
     * DELETE /v1/kiva/:id/victim => remove entire victim interview
     * DELETE /v1/kiva/:id/actions/:aid => remove an actino
     * DELETE /v1/kiva/:id/followups/:fid => remove a followup
     * DELETE /v1/kiva/:id/evaluations/:eid => remove an evaluation
     */
import { Router, Request, Response, NextFunction } from 'express';
import { JSONError } from '../shared/jsonerror';
import { kivaService } from './kiva.service';
import {
    IKivaFile,
    IKivaFirstEntry,
    IKivaVictimInterview,
    IKivaAction,
    IKivaFollowUp
} from './kiva.file';

export class KivaRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    getOne(req: Request, res: Response, next: NextFunction) {
        return kivaService.getOne(req.params.id)
            .then((result: IKivaFile) => {
                return res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }

    createFile(req: Request, res: Response, next: NextFunction) {
        return kivaService.addFile(req.body)
            .then((result: IKivaFile) => {
                res.setHeader('Location', `${req.baseUrl}/${result._id}`);
                res.status(201).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }

    updateFile(req: Request, res: Response, next: NextFunction) {
        return null;
    }

    createVictimInterview(req: Request, res: Response, next: NextFunction) {

        return kivaService.addVictimInterview(req.params.id, req.body)
            .then((result: IKivaVictimInterview) => {
                res.setHeader('Location', `${req.baseUrl}/${req.params.id}/victim`);
                res.status(201).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    updateVictimInterview(req: Request, res: Response, next: NextFunction) {
        return kivaService.updateVictimInterview(req.params.id, req.body)
            .then((result: IKivaVictimInterview) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            })
    }

    addAction(req: Request, res: Response, next: NextFunction) {
        return kivaService.addAction(req.params.id, req.body)
            .then((result: IKivaAction) => {
                res.setHeader('Location', `${req.baseUrl}/${req.params.id}/action/${result._id}`);
                res.status(201).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    updateAction(req: Request, res: Response, next: NextFunction) {
        return kivaService.updateAction(req.params.id, req.params.aid, req.body)
            .then((result: IKivaAction) => {
                res.status(200).json(result);
            }).catch(err=> {
                next(new JSONError(err));
            });
    }
    addFollowUp(req: Request, res: Response, next: NextFunction) {
        return kivaService.addFollowup(req.params.id, req.body)
            .then((result: IKivaFollowUp) => {
                res.setHeader('Location', `${req.baseUrl}/${req.params.id}/followup/${result._id}`);
                res.status(201).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    updateFollowUp(req: Request, res: Response, next: NextFunction) {
        return kivaService.updateFollowup(req.params.id, req.params.fid, req.body) 
            .then((result: IKivaFollowUp) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }

    init() {
        //SET AUTHORIZATION HERE PER ROUTER FIRST
        this.router.get('/:id', this.getOne);

        this.router.post('/', this.createFile);
        this.router.put('/', this.updateFile);

        this.router.post('/:id/victim', this.createVictimInterview);
        this.router.put('/:id/victim', this.updateVictimInterview);

        this.router.post('/:id/action', this.addAction);
        this.router.put('/:id/action/:aid', this.updateAction);

        this.router.post('/:id/followup', this.addFollowUp);
        this.router.put('/:id/followup/:fid', this.updateFollowUp);
    }
}

export const kivaRoutes = new KivaRouter();
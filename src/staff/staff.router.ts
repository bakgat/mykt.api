import { Request, Response, NextFunction } from 'express';
import { staffService } from './staff.service';
import { IStaff, Staff } from './staff';
import { CrudRouter } from '../shared/crud.router';
import { JSONError } from '../shared/jsonerror';

export class StaffRouter extends CrudRouter<IStaff> {
    public getAll(req: Request, res: Response, next: NextFunction) {
        return super.resolveAll(staffService.getAll(), res, next);
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        return super.resolveOne(staffService.getOne(req.params.id), res, next);
    }

    public create(req: Request, res: Response, next: NextFunction) {
        return super.resolveCreate(staffService.add(req.body), res, req, next);
    }

    public update(req: Request, res: Response, next: NextFunction) {
        return super.resolveUpdate(staffService.update(req.params.id, req.body), res, next);
    }
    public remove(req: Request, res: Response, next: NextFunction) {
        return super.resolveRemove(staffService.remove(req.params.id), res, next);
    }

    public getRoles(req: Request, res: Response, next: NextFunction) {
        staffService.getRoles(req.params.id)
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    public addToRole(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        staffService.addToRole(req.params.id, data.role)
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            })
    }
    public removeFromRole(req: Request, res: Response, next: NextFunction) {
        staffService.removeRole(req.params.id, req.params.role)
            .then(() => {
                res.status(204).send();
            });
    }

    init() {
        super.init();
        this.router.get('/:id/roles', this.getRoles);
        this.router.post('/:id/roles', this.addToRole);
        this.router.delete('/:id/roles/:role', this.removeFromRole);
    }

}

export const staffRoutes = new StaffRouter();
import { Request, Response, NextFunction } from 'express';
import { staffService } from './staff.service';
import { IStaff, Staff } from './staff';
import { CrudRouter } from '../shared/crud.router';

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

    }
    public addToRole(req: Request, res: Response, next: NextFunction) {

    }
    public removeFromRole(req: Request, res: Response, next: NextFunction) {
        
    }
}

export const staffRoutes = new StaffRouter();
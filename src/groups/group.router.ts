import { Router, Request, Response, NextFunction } from 'express';
import { groupService } from './group.service';
import {  IGroup } from './group';
import { CrudRouter } from '../abstract/crud.router';

export class GroupRouter extends CrudRouter<IGroup> {
    public getAll(req: Request, res: Response, next: NextFunction) {
        return super.resolveAll(groupService.getAll(), res);

    }
    public getOne(req: Request, res: Response, next: NextFunction) {
        return super.resolveOne(groupService.getOne(req.params.id), res);
    }
    public create(req: Request, res: Response, next: NextFunction) {
        return super.resolveCreate(groupService.add(req.body), res, req);

    }
    public update(req: Request, res: Response, next: NextFunction) {
        return super.resolveUpdate(groupService.update(req.params.id, req.body), res);

    }
    public remove(req: Request, res: Response, next: NextFunction) {
        return super.resolveRemove(groupService.remove(req.params.id), res);
    }
}

export const groupRoutes = new GroupRouter();
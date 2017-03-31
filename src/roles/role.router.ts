import { Request, Response, NextFunction } from 'express';
import { IRole } from './role';
import { roleService } from './role.service';
import { CrudRouter } from '../shared/crud.router';

export class RoleRouter extends CrudRouter<IRole> {

    public getAll(req: Request, res: Response, next: NextFunction) {
        return super.resolveAll(roleService.getAll(), res, next);
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        return super.resolveOne(roleService.getOne(req.params.id), res, next);
    }

    public create(req: Request, res: Response, next: NextFunction) {
        return super.resolveCreate(roleService.add(req.body), res, req, next);
    }

    public update(req: Request, res: Response, next: NextFunction) {
        return super.resolveUpdate(roleService.update(req.params.id, req.body), res, next);
    }
    public remove(req: Request, res: Response, next: NextFunction) {
        return super.resolveRemove(roleService.remove(req.params.id), res, next);
    }
}

export const roleRoutes = new RoleRouter();
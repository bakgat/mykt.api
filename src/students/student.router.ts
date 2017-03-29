import {  Request, Response, NextFunction } from 'express';
import { studentService } from './student.service';
import { IStudent } from './student';
import { IGroup } from '../groups/group';
import { CrudRouter } from '../abstract/crud.router';

export class StudentRouter extends CrudRouter<IStudent> {
    public getAll(req: Request, res: Response, next: NextFunction) {
        return super.resolveAll(studentService.getAll(), res, next);
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        return super.resolveOne(studentService.getOne(req.params.id), res, next);
    }

    public create(req: Request, res: Response, next: NextFunction) {
        return super.resolveCreate(studentService.add(req.body), res, req, next);
    }

    public update(req: Request, res: Response, next: NextFunction) {
        return super.resolveUpdate(studentService.update(req.params.id, req.body), res, next);
    }
    public remove(req: Request, res: Response, next: NextFunction) {
        return super.resolveRemove(studentService.remove(req.params.id), res, next);
    }

    public getGroups(req: Request, res: Response, next: NextFunction) {
        studentService.getGroups(req.params.id)
            .then(result => {
                res.status(200).json(result);
            });
    }
    public addToGroup(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        studentService.addToGroup(req.params.id, data.group._id, data.start, data.end)
            .then(result => {
                res.status(200).json(result);
            });
    }
    public updateGroup(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        studentService.updateGroupSubscription(req.params.groupId, data.start, data.end)
            .then(result => {
                res.status(200).json(result);
            });
    }
    public removeGroupSubscription(req: Request, res: Response, next: NextFunction) {
        studentService.removeGroupSubscription(req.params.id, req.params.groupId)
            .then(() => {
                res.status(204).send();
            });
    }

    init() {
        super.init();
        this.router.get('/:id/groups', this.getGroups);
        this.router.post('/:id/groups', this.addToGroup);
        this.router.put('/:id/groups/:groupId', this.updateGroup);
        this.router.delete('/:id/groups/:groupId', this.removeGroupSubscription);
    }
}

export const studentRoutes = new StudentRouter();
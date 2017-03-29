import * as mongoose from 'mongoose';
import { Router, Request, Response, NextFunction } from 'express';
import { JSONError } from './jsonerror';

export abstract class CrudRouter<T extends mongoose.Document> {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public abstract getAll(req: Request, res: Response, next: NextFunction);
    public abstract getOne(req: Request, res: Response, next: NextFunction);
    public abstract create(req: Request, res: Response, next: NextFunction);
    public abstract update(req: Request, res: Response, next: NextFunction);
    public abstract remove(req: Request, res: Response, next: NextFunction);

    protected resolveAll(data: Promise<Array<T>>, res: Response, next: NextFunction) {
        return data.then((result: Array<T>) => {
            res.status(200).json(result);
        }).catch(err => {
            next(new JSONError(err));
        });
    }
    protected resolveOne(data: Promise<T>, res: Response, next: NextFunction) {
        return data.then((result: T) => {
            if (result) {
                res.status(200).json(result);
            } else {
                next(new JSONError(null, 404));
            }
        }).catch(err => {
            next(new JSONError(err));
        });
    }
    protected resolveCreate(data: Promise<T>, res: Response, req: Request, next: NextFunction) {
        return data.then((result: T) => {
            res.setHeader('Location', `${req.baseUrl}/${result._id}`);
            res.status(201).json(result);
        }).catch(err => {
            next(new JSONError(err));
        });
    }
    protected resolveUpdate(data: Promise<T>, res: Response, next: NextFunction) {
        return data.then((result: T) => {
            if (result) {
                res.status(200).json(result);
            } else {
                next(new JSONError(null, 404));
            }
        }).catch(err => {
            next(new JSONError(err));
        });
    }
    protected resolveRemove(data: Promise<T>, res: Response, next: NextFunction) {
        return data.then(result => {
            if (result) {
                res.status(204).send();
            } else {
                next(new JSONError(null, 404));
            }
        }).catch(err => {
            next(new JSONError(err));
        });
    }

    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.remove);
    }

}
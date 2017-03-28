import * as mongoose from 'mongoose';
import { Router, Request, Response, NextFunction } from 'express';

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

    protected resolveAll(data: Promise<Array<T>>, res: Response) {
        return data.then((result: Array<T>) => {
            res.status(200).json(result);
        });
    }
    protected resolveOne(data: Promise<T>, res: Response) {
        return data.then((result: T) => {
            res.status(200).json(result);
        });
    }
    protected resolveCreate(data: Promise<T>, res: Response, req: Request) {
        return data.then((result: T) => {
            res.setHeader('Location', `${req.baseUrl}/${result._id}`);
            res.status(201).json(result);
        });
    }
    protected resolveUpdate(data: Promise<T>, res: Response) {
        return data.then((result: T) => {
            res.status(200).json(result);
        });
    }
    protected resolveRemove(data: Promise<T>, res: Response) {
        return data.then(() => {
            res.status(204).send();
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
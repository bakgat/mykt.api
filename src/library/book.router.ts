import { Request, Response, NextFunction } from 'express';
import { bookService, IBook } from './index';
import { CrudRouter } from '../shared/crud.router';
import { JSONError } from '../shared/jsonerror';

export class BookRouter extends CrudRouter<IBook> {
    public getAll(req: Request, res: Response, next: NextFunction) {
        return super.resolveAll(bookService.getAll(), res, next);
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        return super.resolveOne(bookService.getOne(req.params.id), res, next);
    }

    public create(req: Request, res: Response, next: NextFunction) {
        return super.resolveCreate(bookService.add(req.body), res, req, next);
    }

    public update(req: Request, res: Response, next: NextFunction) {
        return super.resolveUpdate(bookService.update(req.params.id, req.body), res, next);
    }
    public remove(req: Request, res: Response, next: NextFunction) {
        return super.resolveRemove(bookService.remove(req.params.id), res, next);
    }

    public getTags(req: Request, res: Response, next: NextFunction) {
        
    }
    public addTag(req: Request, res: Response, next: NextFunction) {
    }
    public removeTag(req: Request, res: Response, next: NextFunction) {
    }

    public getGroups(req: Request, res: Response, next: NextFunction) {
    }
    public addGroup(req: Request, res: Response, next: NextFunction) {
    }
    public removeGroup(req: Request, res: Response, next: NextFunction) {
    }

    public patchBook(req: Request, res: Response, next: NextFunction) {
        let op = req.body.op;
        switch (op) {
            case 'notes':
                break;
            case 'age':
                break;
        }

    }

    init() {
        this.router.get('/tags', this.getTags);
        this.router.post('/:id/tags', this.addTag);
        this.router.delete('/:id/tags/:tag', this.removeTag);

        this.router.get('/groups', this.getGroups);
        this.router.post('/:id/groups', this.addGroup);
        this.router.delete('/:id/groups/:group', this.removeGroup);

        this.router.patch('/:id', this.patchBook);

        super.init();
    }
}
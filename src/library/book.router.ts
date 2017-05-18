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
        return bookService.getTags()
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    public addTag(req: Request, res: Response, next: NextFunction) {
        return bookService.addTag(req.params.id, req.body.tag)
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    public removeTag(req: Request, res: Response, next: NextFunction) {
        return bookService.removeTag(req.params.id, req.body.tag)
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }

    public getGroups(req: Request, res: Response, next: NextFunction) {
        return bookService.getGroups()
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    public addGroup(req: Request, res: Response, next: NextFunction) {
        return bookService.addGroup(req.params.id, req.body.group)
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }
    public removeGroup(req: Request, res: Response, next: NextFunction) {
        return bookService.removeGroup(req.params.id, req.body.group)
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                next(new JSONError(err));
            });
    }

    public patchBook(req: Request, res: Response, next: NextFunction) {
        let op = req.body.op;
        switch (op) {
            case 'notes':
                return bookService.updateNotes(req.params.id, req.body.notes)
                    .then((result: String) => {
                        res.status(200).json({notes: result});
                    }).catch(err => {
                        next(new JSONError(err));
                    });
            case 'age':
                return bookService.updateAge(req.params.id, req.body.min, req.body.max)
                    .then((result: any) => {
                        res.status(200).json({age: result});
                    }).catch(err => {
                        next(new JSONError(err));
                    });
        }
    }

    public getAuthors(req: Request, res: Response, next: NextFunction) {
        return bookService.getAuthors()
            .then((result: Array<String>) => {
                res.status(200).json(result);
            }).catch(err => {
                
                next(new JSONError(err));
            });
    }

    init() {
        this.router.get('/tags', this.getTags);
        this.router.post('/:id/tags', this.addTag);
        this.router.delete('/:id/tags', this.removeTag);

        this.router.get('/groups', this.getGroups);
        this.router.post('/:id/groups', this.addGroup);
        this.router.delete('/:id/groups', this.removeGroup);

        this.router.get('/authors', this.getAuthors);

        this.router.patch('/:id', this.patchBook);


        super.init();
    }
}

export const bookRoutes = new BookRouter();
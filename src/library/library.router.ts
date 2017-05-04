import { Router } from 'express';
import { bookRoutes } from './book.router';

export class LibraryRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.use('/books', bookRoutes.router);
    }
}

export const libraryRoutes = new LibraryRouter();
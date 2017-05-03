import { GenericCrudService } from '../shared/crud.service';
import { IBook, Book } from './book';

export class BookService extends GenericCrudService<IBook> {
    constructor() {
        super();
        this._model = Book;
    }
    getTags() {
        return Book.distinct('tags').exec();
    }
    addTag(id: String, tag: String) {
        return Book.findByIdAndUpdate(id, { $addToSet: { tags: tag } }, { new: true })
            .exec()
            .then(result => {
                return result.tags;
            });
    }
    removeTag(id: String, tag: String) {
        return Book.findByIdAndUpdate(id, { $pull: { tags: tag } }, { new: true })
            .exec()
            .then(result => {
                return result.tags;
            });
    }

    addGroup(id: String, group: String) {
        return Book.findByIdAndUpdate(id, { $addToSet: { groups: group } }, { new: true })
            .exec()
            .then(result => {
                return result.groups
            })
    }
    removeGroup(id: String, group: String) {
        return Book.findByIdAndUpdate(id, { $pull: { groups: group } }, { new: true })
            .exec()
            .then(result => {
                return result.groups;
            });
    }

    updateNotes(id: String, notes: String) {
        return Book.findByIdAndUpdate(id, { notes: notes }, { new: true })
            .exec()
            .then(result => {
                return result.notes;
            });
    }

    updateAge(id: String, min: Number, max: Number) {
        return Book.findByIdAndUpdate(id, { 'age.min': min, 'age.max': max }, { new: true })
            .exec()
            .then(result => {
                return result.age;
            });
    }

}

export const bookService = new BookService();
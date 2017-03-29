import * as mongoose from 'mongoose';

export interface ICrudService<T extends mongoose.Document> {
    getAll(): Promise<Array<T>>;
}

export abstract class GenericCrudService<T extends mongoose.Document> implements ICrudService<T> {
    protected _model: mongoose.Model<T>;
    protected _select: string = null;

    getAll(): Promise<Array<T>> {
        var query: mongoose.DocumentQuery<Array<T>, T> = this._model.find({});
        if (this._select) {
            query.select(this._select);
        }
        return query.exec();
    }
    getOne(id): Promise<T> {
        return this._model.findById(id).exec();
    }
    add(data: T): Promise<T> {
        var obj = new this._model(data);
        return obj.save();
    }
    update(id: any, data: T): Promise<T> {
        return this._model.findOneAndUpdate({ _id: id }, data, { new: true })
            .exec();
    }
    remove(id: any): Promise<T> {
        return this._model.findByIdAndRemove(id).exec();
    }

}

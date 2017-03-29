import { Staff, IStaff } from './staff';
import { GenericCrudService } from '../abstract/crud.service';

export class StaffService extends GenericCrudService<IStaff> {
    constructor() {
        super();
        this._model = Staff;
        this._select = '-groups';
    }
}

export const staffService = new StaffService();
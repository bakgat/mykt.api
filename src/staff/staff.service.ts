import { Staff, IStaff } from './staff';
import { GenericCrudService } from '../shared/crud.service';

export class StaffService extends GenericCrudService<IStaff> {
    constructor() {
        super();
        this._model = Staff;
        this._select = '-groups';
    }
}

export const staffService = new StaffService();

import { Group, IGroup } from './group';
import { GenericCrudService } from '../shared/crud.service';

export class GroupService extends GenericCrudService<IGroup> {
    constructor() {
        super();
        this._model = Group;
    }
}

export const groupService = new GroupService();
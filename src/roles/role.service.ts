import { Role, IRole } from './role';
import { GenericCrudService } from '../shared/crud.service';

export class RoleService extends GenericCrudService<IRole> {
    constructor() {
        super();
        this._model = Role;
    }

    find(name: string) {
        return Role.findOne({name: name}).exec();
    }
}

export const roleService = new RoleService();
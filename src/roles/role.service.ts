import { Role, IRole } from './role';
import { GenericCrudService } from '../shared/crud.service';

export class RoleService extends GenericCrudService<IRole> {
    constructor() {
        super();
        this._model = Role;
    }
}

export const roleService = new RoleService();
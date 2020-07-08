import { BaseModel } from '../../_base/crud';
import { Role } from "./role.model";

export class User extends BaseModel {
    id?: number;
    nom?: string;
    prenom?: string;
    fullname?: string;
    password?: string;
    trigramme?: string;
    email?: string;
    fonction_id?: number;
    access_token?: string;
    refresh_token?: string;
    personnel_id?: string;
    // sirh_token?: string;
    // sirh_access?: string;
    is_firstConnexion?: boolean;
	role?: Role;

    clear?(): void {
        this.id = undefined;
        this.nom = '';
        this.prenom = '';
        this.trigramme = '';
        this.fullname = '';
        this.fonction_id = 0;
        this.password = '';
        this.email = '';
        this.role = null;
    }
}

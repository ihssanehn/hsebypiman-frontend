import { BaseModel } from '../../_base/crud';
import { Role } from "./role.model";

export class User extends BaseModel {
    id: number;
    nom: string;
    prenom: string;
    password?: string;
    email?: string;
    fonction_id?: number;
    access_token?: string;
    refresh_token?: string;
	role?: Role;

    clear(): void {
        this.id = undefined;
        this.nom = '';
        this.prenom = '';
        this.fonction_id = 0;
        this.password = '';
        this.email = '';
        this.role = null;
    }
}

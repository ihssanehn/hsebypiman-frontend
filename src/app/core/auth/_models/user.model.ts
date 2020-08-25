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
    is_firstConnexion?: boolean;
    role?: Role;
    user_connection?: string;
    
    date_entree?: Date;
    date_naissance?: Date;
    nom_urgence?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    fonction?: any;
    rqth?: any;
    date_visite_medicale_passed: Date;
    date_visite_medicale_next: Date;
    latest_visite_medicale?: any;

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

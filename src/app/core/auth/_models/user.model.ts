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
    is_quiz_approved?: boolean;
    quiz_score?: string;
    quiz_date?: Date;
    role?: Role;
    user_connection?: string;
    pivot?: any;
    
    date_entree?: Date;
    date_naissance?: Date;
    nom_urgence?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    fonction?: any;
    rqth?: any;
    date_visite_medicale_passed?: Date;
    date_visite_medicale_next?: Date;
    latest_visite_medicale?: any;
    entreprise_interim?: string;
    manager?: any;
    is_virtual?: any;
    is_blocked?: any;
    entity?: any;
    bu?: any;
    profit_center?: any;
    client?: any;
    photo_profil_id?: Number;
    photo_profil?: any;
    date_realisation_accueil_secu?: Date;
    date_realisation_livret_accueil?: Date;
    base_name?: string;

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

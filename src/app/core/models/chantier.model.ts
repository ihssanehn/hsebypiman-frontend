import { Habilitation, Entreprise, Status, Ar } from './';
import {User} from '../auth';

export class Chantier {
    id?: number;
    nom?: String;
    type_id?: number;
    type?: any;
    status_id?: number;
    status?: Status;
    numero?: String;
    adresse?: String;
    ville?: String;
    code_postal?: String;
    pays?: String;
    client?: String;
    contact?: String;
    montant?: number;
    date_demarrage?: Date;
    no_hab_required?:boolean;
    charge_affaire_id?: number;
    charge_affaire?: User;
    resp_chiffrage_id?: number;
    resp_chiffrage?: User;
    ars?: Array<Ar>;
    latest_ar?: Ar;
    ars_count?: number;
    vss?: Array<any>;
    latest_vs?: any;
    vss_count?: number;
    ar?: Ar;
    habilitations?: Habilitation[];
    entreprises?: Entreprise[];
    info?: Array<string>;
    is_all_ars_archived?: boolean;
    is_all_ars_signed?: boolean;
}
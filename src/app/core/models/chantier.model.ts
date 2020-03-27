
export class ChantierModel {
    _id?: number;
    nom?: String;
    type_id?: number;
    type?: any;
    status_id?: number;
    status?: any;
    numero?: String;
    adresse?: String;
    ville?: String;
    code_postal?: String;
    pays?: String;
    client?: String;
    contact?: String;
    montant?: number;
    date_demarrage?: Date;
    charge_affaire_id?: number;
    charge_affaire?: any;
    ars?: Array<any>;
    latest_ar?: any;
    ars_count?: number;
    vss?: Array<any>;
    latest_vs?: any;
    vss_count?: number;
}
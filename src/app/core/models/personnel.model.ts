
export class Personnel {
    id?: number;
    nom?: string;
    prenom?: string;
    fullname?: string;
    email?: string;
    fonction_id?: number;
    date_entree?: Date;
    date_naissance?: Date;
    nom_urgence?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    fonction?: any;
    rqth?: any;
    latest_visite_medicale?: any;
    metricsTree?: Array<any>;
    catMetricsList?: Array<any>;
    formations?: any;
}

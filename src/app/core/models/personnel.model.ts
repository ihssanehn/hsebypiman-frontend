
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
    date_visite_medicale_passed: Date;
    date_visite_medicale_next: Date;
    latest_visite_medicale?: any;
    metricsTree?: Array<any>;
    catMetricsList?: Array<any>;
    period_id: Number;
    formations?: any;
    photo_profil_id?: Number;
    photo_profil?: any;
    passeport_hse?: number;
    remontees?: number;
    causerie?: number;
    epi?: number;
    formation?: number;

}

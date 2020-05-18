import { Risque, Equipement, Zone, CatRisqueComment } from './';

export class Ar {
    id?: number;
    code?: string;
    chantier_id?: number;
    date?: Date;
    a_prevoir_compagnons?: boolean;
    date_accueil_secu?: Date;
    realisateur?: string;
    tel_realisateur?: string;
    date_validite?: Date;
    contact_interne_secours?: string;
    tel_contact_interne_secours?: string;
    contact_client_chef_chtr?: string;
    tel_contact_client_chef_chtr?: string;
    contact_client_hse?: string;
    tel_contact_client_hse?: string;
    heure_ouverture?: number;
    heure_fermeture?: number;
    courant_dispo?: string;
    
    observations_signature?: string;
    salarie_id?: number;
    status_id?: number;
    status?: any;
    creator_id?: number;
    a_signer_registre_travaux?: boolean;
    a_prevoir_balisage?: boolean;
    risques?: Array<Risque>;
    equipements?: Array<Equipement>;
    zones?: Array<Zone>;
    cat_risques?: Array<CatRisqueComment>;
    accueil_secu_days?: Array<string>;
    accueil_secu_time_opening?: number;
    accueil_secu_time_closing?: number;
    registre_signing_period?: string;

    adresse_charge_registre?: string;
    ville_charge_registre?: string;
    codepostal_charge_registre?: string;
    nom_charge_registre?: string;
    tel_charge_registre?: string;
    pays_charge_registre?: string;
    nom_ca_cvti?: string;
    tel_ca_cvti?: string;
    assistant_ca?: string;
    tel_assistant_ca?: string;
    is_signed?: boolean;

    zonesGrouped?:Array<any>;
    risksTree?:Array<any>;
}
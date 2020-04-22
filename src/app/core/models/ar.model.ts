import { Risque } from './risque.model';
import { EpiType } from './epiType.model';
import { CatRisqueComment } from './catRisqueComment.model';

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
    num_secours?: string;
    contact_interne_secours?: string;
    tel_contact_interne_secours?: string;
    contact_client_chef_chtr?: string;
    tel_contact_client_chef_chtr?: string;
    contact_client_hse?: string;
    tel_contact_client_hse?: string;
    heure_ouverture?: number;
    heure_fermeture?: number;
    courant_dispo?: string;
    zone_part?: boolean;
    parking_salarie?: boolean;
    parking_spe_chtr?: boolean;
    stat_arr?: boolean;
    algeco_cvti?: boolean;
    zone_ext_non_surv?: boolean;
    zone_surv_balisee?: boolean;
    prevoir_balisage_materiel?: boolean;
    observations?: string;
    salarie_id?: number;
    status_id?: number;
    creator_id?: number;
    a_signer_registre_travaux?: boolean;
    a_prevoir_balisage?: boolean;
    risques?: Array<Risque>;
    epi_types?: Array<EpiType>;
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


}
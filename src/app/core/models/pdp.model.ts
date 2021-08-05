import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

export class Pdp {
	creator_id?: number;
	cse_eu_job?: string;
	cse_eu_name?: string;
	cse_eu_tel?: string;
	duration_intervention_mp400h?: number;
	effectif_moyen?: number;
	horaires_ouverture_site?: string;
	id?: number;
	is_astreinte?: boolean;
	is_night_shift?: boolean;
	is_piman_intervention?: boolean;
	is_presence_site_client?: boolean;
	is_teletravail?: boolean;
	label_intervention?: string;
	lieu_intervention?: string;
	medecin_travail_ee_name?: string;
	medecin_travail_ee_tel?: string;
	medecin_travail_eu_name?: string;
	medecin_travail_eu_tel?: string;
	pdp_intervention_at?: string;
	pole_qhse?: string;
	presence_site_client_frequency?: string;
	raison_sociale_eu?: string;
	raison_sociale_tel_eu?: string;
	representant_entreprise_ee_mail?: string;
	representant_entreprise_ee_name?: string;
	representant_entreprise_ee_tel?: string;
	representant_entreprise_eu_mail?: string;
	representant_entreprise_eu_name?: string;
	representant_entreprise_eu_tel?: string;
	sauveteurs_secouriste_travail?: string;
	sous_traitant?: Array<any>;
	sous_traitant1_name?: string;
	sous_traitant1_tel?: string;
	sous_traitant2_name?: string;
	sous_traitant2_tel?: string;
	pdp_consigne_ee?: Array<any>;
	pdp_moyen_disposition_ee?: Array<any>;
	pdp_epi_disposition_ee?: Array<any>;
	pdp_travaux_dangereux?: Array<any>;
	pdp_answer_risques?: Array<any>;
	pdp_validations?: Array<any>;
	intervenants?: Array<any>;
}

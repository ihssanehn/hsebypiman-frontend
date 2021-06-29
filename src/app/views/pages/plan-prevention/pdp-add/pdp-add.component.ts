import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
	selector: 'tf-pdp-add',
	templateUrl: './pdp-add.component.html',
	styleUrls: ['./pdp-add.component.scss']
})
export class PdpAddComponent implements OnInit {

	pdpForm: FormGroup;

	constructor(
		private pdpFB: FormBuilder,
	) {
	}

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.pdpForm = this.pdpFB.group({
			raison_sociale_eu: [null],
			raison_sociale_tel_eu: [null],
			sauveteurs_secouriste_travail: [null, Validators.required],
			pole_qhse: [null],
			medecin_travail_eu_name: [null],
			medecin_travail_eu_tel: [null],
			cse_eu_name: [null],
			cse_eu_job: [null],
			cse_eu_tel: [null],
			representant_entreprise_eu_name: [null],
			representant_entreprise_eu_mail: [null],
			representant_entreprise_eu_tel: [null],

			medecin_travail_ee_name: [null],
			medecin_travail_ee_tel: [null],
			representant_entreprise_ee_name: [null],
			representant_entreprise_ee_mail: [null],
			representant_entreprise_ee_tel: [null],

			is_piman_intervention: ['0'],
			sous_traitant1_name: [null],
			sous_traitant1_tel: [null],
			sous_traitant2_name: [null],
			sous_traitant2_tel: [null],

			label_intervention: [null],
			lieu_intervention: [null],
			pdp_intervention_at: [null],
			horaires_ouverture_site: [null],

			is_night_shift: ['0'],
			duration_intervention_mp400h: ['0'],
			is_astreinte: ['0'],
			is_teletravail: ['0'],
			is_presence_site_client: ['0'],
			effectif_moyen: [null],

			risques: new FormArray([]),
			cat_risques: new FormArray([]),

			// date_accueil_secu:[null, Validators.required],
			// realisateur:['', Validators.required],
			// tel_realisateur:['', Validators.required],
			// date_validite:[null, Validators.required],
			// accueil_secu_days:[null, Validators.required],
			// accueil_secu_time_opening:['', Validators.required],
			// accueil_secu_time_closing:['', Validators.required],
			//
			// contact_interne_secours:[null, Validators.required],
			// tel_contact_interne_secours:['', Validators.required],
			// contact_client_chef_chtr:['', Validators.required],
			// tel_contact_client_chef_chtr:['', Validators.required],
			// contact_client_hse:['', Validators.required],
			// tel_contact_client_hse:['', Validators.required],
			// heure_ouverture:[this.params['heure_ouverture'], Validators.required],
			// heure_fermeture:[this.params['heure_fermeture'], Validators.required],
			// courant_dispo:[this.params['courant_dispo'], Validators.required],
			//
			// a_signer_registre_travaux:['0', Validators.required],
			// registre_signing_period:['quotidiennement'],
			// nom_charge_registre:[null],
			// adresse_charge_registre:[''],
			// ville_charge_registre:[null],
			// pays_charge_registre:[null],
			// codepostal_charge_registre:[''],
			// tel_charge_registre:[''],
			//
			// a_prevoir_balisage:['0', Validators.required],
			//
			// observations_signature:[''],
			// risques:new FormArray([]),
			// cat_risques:new FormArray([]),
			// equipements:new FormArray([]),
			// zones:new FormArray([]),
			// comments:new FormArray([]),
		});
	}

}

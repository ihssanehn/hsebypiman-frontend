import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
	selector: 'tf-pdp-add',
	templateUrl: './pdp-add.component.html',
	styleUrls: ['./pdp-add.component.scss']
})
export class PdpAddComponent implements OnInit {

	pdpForm: FormGroup;
	enableBtn = false;
	formloading: boolean = false;

	constructor(
		private pdpFB: FormBuilder,
	) {
	}

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.pdpForm = this.pdpFB.group({
			raison_sociale_eu: [null, Validators.required],
			raison_sociale_tel_eu: [null, Validators.required],
			sauveteurs_secouriste_travail: [null, Validators.required],
			pole_qhse: [null],
			medecin_travail_eu_name: [null],
			medecin_travail_eu_tel: [null],
			cse_eu_name: [null],
			cse_eu_job: [null],
			cse_eu_tel: [null],
			representant_entreprise_eu_name: [null, Validators.required],
			representant_entreprise_eu_mail: [null],
			representant_entreprise_eu_tel: [null, Validators.required],

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

			label_intervention: [null, Validators.required],
			lieu_intervention: [null, Validators.required],
			pdp_intervention_at: [null, Validators.required],
			horaires_ouverture_site: [null, Validators.required],

			is_night_shift: ['0', Validators.required],
			duration_intervention_mp400h: ['0'],
			is_astreinte: ['0', Validators.required],
			is_teletravail: ['0', Validators.required],
			is_presence_site_client: ['0', Validators.required],
			effectif_moyen: [null],

			consignes: new FormArray([]),
			epi_disposition: new FormArray([]),
			moyen_disposition_ees: new FormArray([]),
			travaux_dangereux: new FormArray([]),
			risques: new FormArray([]),
		});
	}

	async onSubmit() {
		console.log('here');
		console.log(this.pdpForm.valid)

	}

	isLastStep(isLastStep: boolean): void {
		if (isLastStep) {
			this.enableBtn = true;
		}
	}
}

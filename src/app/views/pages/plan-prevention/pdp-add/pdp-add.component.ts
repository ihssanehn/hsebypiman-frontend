import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal, {SweetAlertIcon} from 'sweetalert2';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {ArService, PdpService} from '@app/core/services';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Ar, Pdp, RisqueModel} from '@app/core/models';
import {Subscription} from 'rxjs';
import {RisqueMoyenModel} from "@app/core/models/consigne.model";

@Component({
	selector: 'tf-pdp-add',
	templateUrl: './pdp-add.component.html',
	styleUrls: ['./pdp-add.component.scss']
})
export class PdpAddComponent implements OnInit, OnDestroy {

	pdpForm: FormGroup;
	enableBtn = false;
	formloading = false;
	pdp: Pdp = null;
	adding = true;
	formStatus = new FormStatus();

	private subscriptions: Subscription[] = [];

	constructor(
		private pdpFB: FormBuilder,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private activatedRoute: ActivatedRoute,
		private pdpService: PdpService,
	) {
	}

	ngOnInit() {
		this.createForm();
		const routeSubscription = this.activatedRoute.params
			.subscribe(
				async params => {
					const id = params.id;
					if (id) {
						this.adding = false;
						this.pdpService
							.get(id)
							.subscribe(async res => {
								this.pdp = res.result.data;
								this.pdpForm.patchValue(this.pdp);
								console.log(this.pdpForm);
								this.enableBtn = true;
								this.cdr.markForCheck();
							});
					} else {
						this.pdp = new Pdp();
					}
				}
			);
		this.subscriptions.push(routeSubscription);
	}


	createForm() {
		this.pdpForm = this.pdpFB.group({
			raison_sociale_eu: [null, Validators.required],
			raison_sociale_tel_eu: [null, Validators.required],
			sauveteurs_secouriste_travail: [null],
			pole_qhse: [null],
			medecin_travail_eu_name: [null],
			medecin_travail_eu_tel: [null],
			cse_eu_name: [null],
			cse_eu_job: [null],
			cse_eu_tel: [null],
			hse_eu_name: [null],
			hse_eu_mail: [null],
			hse_eu_tel: [null],
			representant_entreprise_eu_name: [null, Validators.required],
			representant_entreprise_eu_mail: [null, Validators.email],
			representant_entreprise_eu_tel: [null, Validators.required],

			medecin_travail_ee_name: [null],
			medecin_travail_ee_tel: [null],
			representant_entreprise_ee_name: [null],
			representant_entreprise_ee_mail: [null, Validators.email],
			representant_entreprise_ee_tel: [null],

			is_piman_intervention: [null],
			sous_traitant1_name: [null],
			sous_traitant1_tel: [null],
			sous_traitant1_mail: [null],
			sous_traitant2_name: [null],
			sous_traitant2_tel: [null],
			sous_traitant2_mail: [null],

			label_intervention: [null, Validators.required],
			lieu_intervention: [null, Validators.required],
			pdp_intervention_at: [null, Validators.required],
			horaires_ouverture_site: [null, Validators.required],
			horaires_fermeture_site: [null, Validators.required],

			is_night_shift: [null],
			duration_intervention_mp400h: [null],
			is_astreinte: [null],
			is_teletravail: [null],
			is_presence_site_client: [null],
			presence_site_client_frequency_id: [{value: null, disabled: true}],
			effectif_moyen: [null],
			consignes: new FormArray([]),
			epi_disposition: new FormArray([]),
			moyen_disposition_ees: new FormArray([]),
			travaux_dangereux: new FormArray([]),
			cat_pdp_risques: new FormArray([]),
			validations: new FormArray([
				new FormGroup({
					need_text_area_in_title: new FormControl(true),
					title: new FormControl('EE'),
					company_name: new FormControl('', Validators.required),
					full_name: new FormControl('', Validators.required),
					validation_at: new FormControl(null, Validators.required),
					type: new FormControl('ee', Validators.required),
					deletable: new FormControl(false),
					is_part_inspection: new FormControl(null),
					part_inspection_at: new FormControl({value: null, disabled: true}),
				}),
				new FormGroup({
					need_text_area_in_title: new FormControl(false),
					title: new FormControl('EU'),
					company_name: new FormControl('PIMAN Consultants', Validators.required),
					full_name: new FormControl('', Validators.required),
					validation_at: new FormControl(null, Validators.required),
					type: new FormControl('eu', Validators.required),
					deletable: new FormControl(false),
					is_part_inspection: new FormControl(null),
					part_inspection_at: new FormControl({value: null, disabled: true}),
				}),
				new FormGroup({
					need_text_area_in_title: new FormControl(true),
					title: new FormControl('Sous-traitant'),
					company_name: new FormControl(''),
					full_name: new FormControl(''),
					validation_at: new FormControl(null),
					type: new FormControl('ss'),
					deletable: new FormControl(true),
					is_part_inspection: new FormControl(null),
					part_inspection_at: new FormControl({value: null, disabled: true}),
				})
			]),
			intervenants: new FormArray([
				new FormGroup({
					first_name: new FormControl('', Validators.required),
					last_name: new FormControl('', Validators.required),
					contact: new FormControl('', Validators.required),
					formations: new FormControl(null),
					is_suivi_medical: new FormControl(null),
					motif_id: new FormControl({value: null, disabled: true}),
				})
			]),
			sous_traitant: new FormArray([]),
		});
	}

	async onSubmit() {
		try {
			console.log((this.pdpForm.get('cat_pdp_risques').value as Array<RisqueModel>).findIndex(v => !v.is_eu && !v.is_piman && !v.is_sous_traitant && v.answer) === -1);
			this.pdpForm.markAllAsTouched();
			if (this.pdpForm.valid
				&& (this.pdpForm.get('cat_pdp_risques').value as Array<RisqueModel>).filter(v => v.is_required_situation && v.answer).map(v => v.situation.filter(s => s.answer).length === 0).indexOf(true) === -1 && (this.pdpForm.get('cat_pdp_risques').value as Array<RisqueModel>).findIndex(v => !v.is_eu && !v.is_piman && !v.is_sous_traitant && v.answer) === -1) {
				this.formStatus.onFormSubmitting();
				const form = {...this.pdpForm.getRawValue()};
				if (form && form.validations) {
					form.validations = (form.validations as Array<any>).filter(v => v && v.company_name && v.full_name && v.validation_at).map(v => {
						if (v && !v.is_part_inspection) {
							delete v.is_part_inspection;
							delete v.part_inspection_at;
						}
						return v;
					});
				}
				if (form && this.pdp) {
					form.id = this.pdp.id;
				}
				this.save(form);
			}
		} catch (error) {
			throw error;
		}

	}


	isLastStep(isLastStep: boolean): void {
		if (isLastStep) {
			this.enableBtn = true;
		}
	}

	fireNotifAfterSave(res: any) {
		let code = res.message.code as SweetAlertIcon;
		let message = res.message.content !== 'done' ? '<b class="text-' + code + '">' + res.message.content + '</b>' : null;

		Swal.fire({
			icon: code,
			title: this.pdp ? this.translate.instant('PDP.NOTIF.PDP_UPDATED.TITLE') : this.translate.instant('PDP.NOTIF.PDP_CREATED.TITLE'),
			showConfirmButton: false,
			html: message,
			timer: code === 'success' ? 1500 : 3000
		}).then(() => {
			this.router.navigate(['/plan-de-prevention/list']);
		});
	}

	async save(form) {
		console.log('saving....');
		this.formloading = true;
		const action = !this.adding ? this.pdpService.update(form).toPromise() : this.pdpService.create(form).toPromise();

		action.then((res: any) => {
			this.fireNotifAfterSave(res);
		})
			.catch(err => {
				Swal.fire({
					icon: 'error',
					title: this.translate.instant('PDP.NOTIF.INCOMPLETE_FORM.TITLE'),
					showConfirmButton: false,
					timer: 2000
				});

				if (err.status === 422) {
					let messages = extractErrorMessagesFromErrorResponse(err);
					this.formStatus.onFormSubmitResponse({success: false, messages});
				}
			}).finally(() => {
			this.formloading = false;
			this.cdr.markForCheck();
		});
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}

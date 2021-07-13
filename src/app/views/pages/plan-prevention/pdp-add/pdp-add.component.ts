import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal, {SweetAlertIcon} from "sweetalert2";
import {FormStatus} from "@app/core/_base/crud/models/form-status";
import {extractErrorMessagesFromErrorResponse} from "@app/core/_base/crud";
import {ArService, PdpService} from "@app/core/services";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {Ar, Pdp} from "@app/core/models";
import {Subscription} from "rxjs";

@Component({
	selector: 'tf-pdp-add',
	templateUrl: './pdp-add.component.html',
	styleUrls: ['./pdp-add.component.scss']
})
export class PdpAddComponent implements OnInit, OnDestroy {

	pdpForm: FormGroup;
	enableBtn = false;
	formloading = false;
	pdp: Pdp;
	loaded = false;
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
		const routeSubscription = this.activatedRoute.queryParams
			.subscribe(
				async params => {
					const id = params.ar_id;
					if (id) {
						this.pdpService
							.get(id)
							.pipe(
								tap(
									pdp => {
										// var _ar = ar.result.data;
										// _ar.date_accueil_secu = this.dateEnToFrPipe.transform(_ar.date_accueil_secu);
										// _ar.date_validite = this.dateEnToFrPipe.transform(_ar.date_validite);
										// this.arForm.patchValue(ar.result.data);
										// this.fillForm(ar.result.data);
										console.log(pdp);
									}
								)
							)
							.subscribe(async res => {
								this.pdp = res.result.data;
								this.loaded = true;
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
			sauveteurs_secouriste_travail: [null, Validators.required],
			pole_qhse: [null],
			medecin_travail_eu_name: [null],
			medecin_travail_eu_tel: [null],
			cse_eu_name: [null],
			cse_eu_job: [null],
			cse_eu_tel: [null],
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
			sous_traitant2_name: [null],
			sous_traitant2_tel: [null],

			label_intervention: [null, Validators.required],
			lieu_intervention: [null, Validators.required],
			pdp_intervention_at: [null, Validators.required],
			horaires_ouverture_site: [null, Validators.required],

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
			validations: new FormArray([]),
			intervenants: new FormArray([new FormGroup({
				first_name: new FormControl('', Validators.required),
				last_name: new FormControl('', Validators.required),
				contact: new FormControl('', Validators.required),
				formations: new FormControl(null),
				is_suivi_medical: new FormControl(null),
				motif: new FormControl({value: null, disabled: true}),
			})]),
		});
	}

	async onSubmit() {
		try {

			console.log(this.pdpForm.valid, this.pdpForm);
			this.pdpForm.markAllAsTouched();
			if (this.pdpForm.valid) {
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
				console.log(form);
				this.save(form);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}

	}

	isLastStep(isLastStep: boolean): void {
		if (isLastStep) {
			this.enableBtn = true;
		}
	}

	fireNotifAfterSave(res: any) {
		var code = res.message.code as SweetAlertIcon;
		var message = res.message.content !== 'done' ? '<b class="text-' + code + '">' + res.message.content + '</b>' : null;

		Swal.fire({
			icon: code,
			title: this.translate.instant("ARS.NOTIF.PDP_CREATED.TITLE"),
			showConfirmButton: false,
			html: message,
			timer: code === 'success' ? 1500 : 3000
		}).then(() => {
			this.router.navigate(['/plan-de-prevention/list']);
		});
	}

	async save(form) {

		this.formloading = true;

		this.pdpService.create(form)
			.toPromise()
			.then((res: any) => {
				console.log(res);

				this.formloading = false;
				this.cdr.markForCheck();
				this.fireNotifAfterSave(res)
			})
			.catch(err => {
				console.log('here');
				this.formloading = false;
				Swal.fire({
					icon: 'error',
					title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
					showConfirmButton: false,
					timer: 2000
				});

				if (err.status === 422) {
					var messages = extractErrorMessagesFromErrorResponse(err);
					this.formStatus.onFormSubmitResponse({success: false, messages: messages});
					this.cdr.markForCheck();
				}
			});

		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}

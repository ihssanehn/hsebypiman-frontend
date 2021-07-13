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
		const routeSubscription = this.activatedRoute.params
			.subscribe(
				async params => {
					const id = params.id;
					console.log(params);
					if (id) {
						this.pdpService
							.get(id)
							.pipe(
								tap(
									pdp => {
										const _pdp = pdp.result.data;
										this.pdpForm.patchValue(_pdp);
										this.formPathValues(_pdp);
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

	formPathValues(pdp: Pdp) {
		console.log(pdp);
		if (pdp.is_presence_site_client) {
			this.pdpForm.get('presence_site_client_frequency_id').enable();
		}

		const consignesArray: FormArray = this.pdpForm.get('consignes') as FormArray;
		consignesArray.patchValue(pdp.pdp_consigne_ee.map(v => {
			return {id: v.consigne_ee_id, answer: v.answer, type_operation: v.type_operation, comment: v.comment};
		}));
		consignesArray.controls.map((c: FormGroup) => {
			if (c.get('answer').value) {
				c.get('comment').enable();
				if (c.get('type_operation')) {
					c.get('type_operation').enable();
				}
				c.updateValueAndValidity();
			}
		});

		const epiDispositionArray: FormArray = this.pdpForm.get('epi_disposition') as FormArray;
		epiDispositionArray.patchValue(pdp.pdp_epi_disposition_ee.map(v => {
			return {
				id: v.epi_disposition_ee_id,
				answer: v.answer,
				answer_id: v.answer_id,
				is_ee: v.is_ee,
				is_eu: v.is_eu,
				is_sous_traitant: v.is_sous_traitant,
				comment: v.comment
			};
		}));
		epiDispositionArray.controls.map((c: FormGroup) => {
			if (c.get('answer').value) {
				c.get('comment').enable();
				c.get('is_ee').enable();
				c.get('is_eu').enable();
				c.get('is_sous_traitant').enable();
				if (c.get('answer_id')) {
					c.get('answer_id').enable();
				}
				c.updateValueAndValidity();
			}
		});

		const moyenDisposition: FormArray = this.pdpForm.get('moyen_disposition_ees') as FormArray;
		moyenDisposition.patchValue(pdp.pdp_moyen_disposition_ee.map(v => {
			return {
				id: v.moyen_disposition_ee_id,
				answer: v.answer,
				comment: v.comment
			};
		}));
		moyenDisposition.controls.map((c: FormGroup) => {
			if (c.get('answer').value) {
				c.get('comment').enable();
				c.updateValueAndValidity();
			}
		});

		const travauxDangereux: FormArray = this.pdpForm.get('travaux_dangereux') as FormArray;
		travauxDangereux.patchValue(pdp.pdp_travaux_dangereux.map(v => {
			return {
				id: v.travaux_dangereux_id,
				answer: v.answer
			};
		}));

		const risques: FormArray = this.pdpForm.get('cat_pdp_risques') as FormArray;
		risques.patchValue(pdp.pdp_answer_risques.map(v => {
			return {
				id: v.cat_pdp_risque_id,
				answer: v.answer,
				comment: v.comment,
				answer_id: v.answer_id,
				is_ee: v.is_ee,
				is_eu: v.is_eu,
				is_sous_traitant: v.is_sous_traitant,
				other_cat_pdp_risque: v.other_cat_pdp_risque,
				other_pdp_moyen_risque: v.other_pdp_moyen_risque,
				other_pdp_situation_risque: v.other_pdp_situation_risque,
				moyen: [...v.moyens.map(m => {
					return {
						id: m.pdp_risque_id,
						answer: m.answer,
						comment: m.comment,
						pdp_risque_moyen_filtre: m.moyen_filter.map(mf => {
							return {
								id: mf.pdp_risque_moyen_filter_id,
								answer: mf.answer,
								comment: mf.comment,
								answer_id: mf.answer_id
							};
						}),
					};
				})],
				situation: v.situation
			};
		}));
		risques.controls.map((c: FormGroup) => {
			if (c.get('answer').value) {
				c.get('comment').enable();
				c.get('is_eu').enable();
				c.get('is_piman').enable();
				c.get('is_sous_traitant').enable();
				c.get('other_cat_pdp_risque').enable();
				c.get('other_pdp_situation_risque').enable();
				(c.get('other_pdp_moyen_risque') as FormArray).controls.map((v: FormGroup) => {
					v.get('comment').enable();
				});
				(c.get('moyen') as FormArray).controls.map((v: FormGroup) => {
					v.get('answer').enable();
					if (v.get('answer').value && v.get('is_with_comment').value) {
						v.get('comment').enable();
					}
					(v.get('pdp_risque_moyen_filtre') as FormArray).controls.map(f => {
						f.get('answer').enable();
						if (f.get('answer').value && f.get('is_with_comment').value) {
							f.get('comment').enable();
						}
					});
				});
				(c.get('situation') as FormArray).controls.map((v: FormGroup) => {
					v.get('answer').enable();
					if (v.get('answer').value && v.get('is_with_comment').value) {
						v.get('comment').enable();
					}
				});
			}
		});
		// moyenDisposition.controls.map((c: FormGroup) => {
		// 	if (c.get('answer').value) {
		// 		c.get('comment').enable();
		// 		c.updateValueAndValidity();
		// 	}
		// });

		this.pdpForm.updateValueAndValidity();
		// consignesArray..map(e => {
		// 	pdp.pdp_consigne_ee.forEach(element => {
		// 		if (e.id === element.consigne_ee_id) {
		// 			e.se
		// 			console.log(e, element);
		// 			e.answer = element.answer;
		// 			e.comment = element.comment;
		// 			e.type_operation = element.type_operation;
		// 			return;
		// 		}
		// 	});
		// })
		console.log(consignesArray);

		// const equipementFormArray: FormArray = this.arForm.get('equipements') as FormArray;
		// ar.equipements.forEach(element => {
		// 	equipementFormArray.push(new FormControl(element.id));
		// });
		//
		// const zoneFormArray: FormArray = this.arForm.get('zones') as FormArray;
		// ar.zones.forEach(element => {
		// 	zoneFormArray.push(new FormControl(element.id));
		// });
		//
		// const commentsFormArray: FormArray = this.arForm.get('comments') as FormArray;
		// ar.cat_risques.forEach(element => {
		// 	const commentGroup: FormGroup = this.arFB.group({
		// 		'cat_risque_id': element.id,
		// 		'commentaire': element.commentaire
		// 	});
		// 	commentsFormArray.push(commentGroup);
		// });
		//
		// this.arForm.get('chantier_id').setValue(ar.chantier_id);
		// this.arForm.get('a_prevoir_compagnons').setValue(ar.a_prevoir_compagnons+'');
		// this.arForm.get('a_signer_registre_travaux').setValue(ar.a_signer_registre_travaux+'');
		// this.arForm.get('a_prevoir_balisage').setValue(ar.a_prevoir_balisage+'');
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

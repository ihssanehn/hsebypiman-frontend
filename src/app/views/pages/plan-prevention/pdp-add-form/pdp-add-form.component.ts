import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormStatus} from "@app/core/_base/crud/models/form-status";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {take} from "rxjs/operators";
import {
	ConsigneModel,
	DispositionModel,
	Pdp,
	PDPFrequences,
	RisqueModel,
	TraveauxDangereuxModel
} from "@app/core/models";
import {PdpService} from "@app/core/services";
import {BehaviorSubject} from "rxjs";

@Component({
	selector: 'tf-pdp-add-form',
	templateUrl: './pdp-add-form.component.html',
	styleUrls: ['./pdp-add-form.component.scss']
})
export class PdpAddFormComponent implements OnInit {

	pdpForm: FormGroup;

	@Input('pdpForm')
	set pdpFormSetter(value) {
		if (value != null) {
			this.pdpForm = value;
			if (this.getControlsArrayFormName('intervenants')) {
				this.intervenants.next(this.getControlsArrayFormName('intervenants'));
			}
			// this.subPDPFormValidator();
		}
	}

	public _pdp: Pdp;

	@Input('_pdp')
	set pdpPatcher(value) {
		if (value != null) {
			this._pdp = value;
			this.formPathValues(this._pdp);
			// this.subPDPFormValidator();
		}
	}

	@Input() formStatus: FormStatus;
	@Input() adding = true;
	@ViewChild('autosize', {static: true}) autosize: CdkTextareaAutosize;
	@Output() onLastStep: EventEmitter<any> = new EventEmitter<any>();
	public parts = [1];
	public instructionsList: Array<ConsigneModel>;
	public EPIDispositionList: Array<DispositionModel>;
	public EESMoyenDisposition: Array<DispositionModel>;
	public traveauxDangereux: Array<TraveauxDangereuxModel>;
	public validationPlan: Array<any> = [];
	public intervenants = new BehaviorSubject<AbstractControl[]>([]);
	public suivisMedicalIntervenants: Array<any> = [{}];
	public risques: Array<RisqueModel>;
	public frequences: Array<PDPFrequences>;
	displayedColumnsConsignes: string[] = ['consignes', 'comments'];
	displayedColumnsEPIDisposition: string[] = ['label', 'list', 'eu', 'ee', 'sous-traitant'];
	displayedColumnsEESMoyenDisposition: string[] = ['label', 'comments'];
	displayedColumnsTravaux: string[] = ['list'];
	displayedColumnsValidationPlan: string[] = ['company', 'name', 'date', 'participation', 'visa'];
	displayedColumnsIntervenants: string[] = ['last', 'first', 'contact', 'formations', 'suivis_médical'];


	dataSource = new BehaviorSubject<AbstractControl[]>([]);

	constructor(private _ngZone: NgZone,
				private FB: FormBuilder,
				private cdr: ChangeDetectorRef,
				protected pdpService: PdpService) {

	}

	ngOnInit() {
		this.triggerResize();
		this.getPDPConsignes();
		this.validationPlan = [
			{
				title: 'EU',
				type: 'ee',
				need_text_area_in_title: true,
				required: true
			},
			{
				title: 'EE',
				type: 'eu',
				need_text_area_in_title: false,
				company_name: 'PIMAN Consultants',
				required: true
			},
			{title: 'Sous-traitant 1', type: 'ss1', need_text_area_in_title: true, required: false},
			{title: 'Sous-traitant 2', type: 'ss2', need_text_area_in_title: true, required: false},
		];
		if (this.validationPlan.length > 0) {
			const formArray = this.pdpForm.get('validations') as FormArray;
			for (let i = 0; i < this.validationPlan.length; i++) {
				const group = new FormGroup({
					need_text_area_in_title: new FormControl(this.validationPlan[i].need_text_area_in_title),
					company_name: new FormControl(this.validationPlan[i].company_name, this.validationPlan[i].required ? Validators.required : null),
					full_name: new FormControl('', this.validationPlan[i].required ? Validators.required : null),
					validation_at: new FormControl(null, this.validationPlan[i].required ? Validators.required : null),
					type: new FormControl(this.validationPlan[i].type, this.validationPlan[i].required ? Validators.required : null),
					is_part_inspection: new FormControl(null),
					part_inspection_at: new FormControl({value: null, disabled: true}),
				});
				formArray.push(group);
			}
		}
	}

	// subPDPFormValidator() {
	// 	this.pdpForm.valueChanges.subscribe(v => {
	// 		if (v) {
	// 			(this.pdpForm.get('epi_disposition') as FormArray).controls.map(c => {
	// 				c.get('answer_id').setErrors({'required': true});
	// 				c.get('answer_id').markAsTouched();
	// 				c.get('answer_id').markAsDirty();
	// 				c.updateValueAndValidity();
	// 				console.log('here in changes', c.get('answer_id'), c.get('answer_id').hasError('required'));
	// 			});
	// 		}
	// 	});
	// }

	async getPDPConsignes() {
		const res: any = await this.pdpService.getAllPdpFilters().toPromise();
		this.instructionsList = res.result.data ? res.result.data.consignes : [];
		this.EPIDispositionList = res.result.data ? res.result.data.epi_disposition : [];
		this.EESMoyenDisposition = res.result.data ? res.result.data.moyen_disposition_ees : [];
		this.traveauxDangereux = res.result.data ? res.result.data.travaux_dangereux : [];
		this.risques = res.result.data ? res.result.data.risques : [];
		this.suivisMedicalIntervenants = res.result.data ? res.result.data.intervenant : [];
		this.frequences = res.result.data ? res.result.data.frequence : [];
		console.log('here 2');
		if (this.EPIDispositionList.length > 0) {
			this.patchFormArray(this.EPIDispositionList, 'epi_disposition', [{
				name: 'answer_id',
				needTest: false,
				isRequired: true
			}, {name: 'is_eu', needTest: false},
				{name: 'is_ee', needTest: false},
				{
					name: 'is_sous_traitant',
					needTest: false
				}
			]);
		}
		if (this.instructionsList.length > 0) {
			this.patchFormArray(this.instructionsList, 'consignes', [{
				name: 'type_operation',
				needTest: true,
			}], 'has_details');
		}
		if (this.EESMoyenDisposition.length > 0) {
			this.patchFormArray(this.EESMoyenDisposition, 'moyen_disposition_ees');
		}
		if (this.traveauxDangereux.length > 0) {
			this.patchFormArray(this.traveauxDangereux, 'travaux_dangereux');
		}
		if (this.risques.length > 0) {
			const formArray = this.pdpForm.get('cat_pdp_risques') as FormArray;
			for (let i = 0; i < this.risques.length; i++) {
				const group = new FormGroup({
					id: new FormControl(this.risques[i].id),
					label: new FormControl(this.risques[i].label),
					is_other: new FormControl(this.risques[i].is_other),
					answer: new FormControl(false),
					comment: new FormControl({value: null, disabled: true}),
					is_eu: new FormControl({value: null, disabled: true}),
					is_piman: new FormControl({value: null, disabled: true}),
					is_sous_traitant: new FormControl({value: null, disabled: true}),
					other_cat_pdp_risque: new FormControl({value: null, disabled: true}),
					other_pdp_situation_risque: new FormControl({value: null, disabled: true}),
					other_pdp_moyen_risque: new FormArray([]),
					situation: new FormArray([]),
					moyen: new FormArray([]),
				});
				if (this.risques[i].is_other) {
					if (!this.risques[i].other_pdp_moyen_risque || this.risques[i].other_pdp_moyen_risque.length === 0) {
						this.risques[i].other_pdp_moyen_risque = ['', '', ''];
					}
					if (this.risques[i] && this.risques[i].other_pdp_moyen_risque.length === 1) {
						this.risques[i].other_pdp_moyen_risque = [...this.risques[i].other_pdp_moyen_risque, ...['', '']];
					}
					if (this.risques[i] && this.risques[i].other_pdp_moyen_risque.length === 2) {
						this.risques[i].other_pdp_moyen_risque = [...this.risques[i].other_pdp_moyen_risque, ...['']];
					}
					this.risques[i].other_pdp_moyen_risque.map(v => {
						(group.get('other_pdp_moyen_risque') as FormArray).push(new FormGroup({
							comment: new FormControl({value: v, disabled: true})
						}));
					});
				}
				this.risques[i].situation.map(v => {
					(group.get('situation') as FormArray).push(new FormGroup({
						id: new FormControl(v.id),
						is_with_comment: new FormControl(v.is_with_comment),
						label: new FormControl(v.label),
						answer: new FormControl({value: null, disabled: true}),
						comment: new FormControl({value: null, disabled: true})
					}));
				});
				this.risques[i].moyen.map(v => {
					(group.get('moyen') as FormArray).push(new FormGroup({
						id: new FormControl(v.id),
						is_with_comment: new FormControl(v.is_with_comment),
						label: new FormControl(v.label),
						answer: new FormControl({value: null, disabled: true}),
						comment: new FormControl({value: null, disabled: true}),
						pdp_risque_moyen_filtre: new FormArray(v.pdp_risque_moyen_filtre
							? v.pdp_risque_moyen_filtre.map(r => new FormGroup({
								id: new FormControl(r.id),
								is_with_comment: new FormControl(r.is_with_comment),
								answer: new FormControl({value: null, disabled: true}),
								label: new FormControl(r.label),
								comment: new FormControl({value: null, disabled: true})
							})) : [])
					}));
				});
				formArray.push(group);
			}
		}
		// console.log('here 1 ', this._pdp);
		// if (this._pdp) {
		// 	this.formPathValues(this._pdp);
		// }
		this.cdr.markForCheck();
	}

	patchFormArray(array, formArrayName, listAddedControls: Array<any> = [], testAtteName = null) {
		const FormArray = this.pdpForm.get(formArrayName) as FormArray;
		for (let i = 0; i < array.length; i++) {
			const group = new FormGroup({
				id: new FormControl(array[i].id),
				answer: new FormControl(false),
				comment: new FormControl({value: '', disabled: true}),
			});
			listAddedControls.map(v => {
				if (!v.needTest || (i && v.needTest && array[i].has_details)) {
					group.addControl(v.name, new FormControl({
						value: '',
						disabled: true
					}, v.isRequired ? Validators.required : null));
				}
			});
			// console.log(group);
			FormArray.push(group);
		}

	}

	partHided(key) {
		return !this.parts.includes(key);
	}


	triggerResize() {
		// Wait for changes to be applied, then trigger textarea resize.
		this._ngZone.onStable.pipe(take(1))
			.subscribe(() => this.autosize.resizeToFitContent(true));
	}

	isChecked(controlName: string) {
		return this.pdpForm.get(controlName).value === 1 || this.pdpForm.get(controlName).value === true;
	}

	showPart(key) {
		if (!this.parts.includes(key)) {
			this.parts.push(key);
		}
		if (key === 6) {
			this.onLastStep.emit(true);
		}
	}

	isFieldRequired(controlName) {
		if (this.pdpForm && this.pdpForm.controls[controlName]) {
			const control = this.pdpForm.controls[controlName];
			const {validator} = control;
			if (validator) {
				const validation = validator(new FormControl());
				return validation !== null && validation.required === true
			}
		}
		return false
	}

	isControlHasError(controlName: string, validationType: string, ArrayFormName = null, index = null): boolean {
		const control = ArrayFormName ? (this.pdpForm.get(ArrayFormName) as FormArray).controls[index].get(controlName) : this.pdpForm.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validationType) && (control.dirty || control.touched);
	}

	updateToggleValue(event, controlName) {
		this.pdpForm.controls[controlName].setValue(event.checked ? 1 : 0);
	}

	makePresenceSiteClientRequired(event) {
		this.pdpForm.controls['presence_site_client_frequency_id'].setValidators(event.checked ? Validators.required : null);
		event.checked ? this.pdpForm.controls['presence_site_client_frequency_id'].enable() : this.pdpForm.controls['presence_site_client_frequency_id'].disable()
		this.pdpForm.controls['presence_site_client_frequency_id'].updateValueAndValidity();
	}


	onCheckBoxChange(event, FormControlName, value = null) {
		const formArray: FormArray = this.pdpForm.get(FormControlName) as FormArray;
		this.manageCheckBoxSelection(event.source.value || value, event.checked, formArray);

	}

	allowOtherFields(ArrayFormName, index, listFormControls: Array<string>, isDisabled) {
		const controlGroup = (this.pdpForm.get(ArrayFormName) as FormArray).controls[index];
		if (isDisabled) {
			controlGroup.get('comment').enable();
			listFormControls.map(v => {
				if (controlGroup.get(v)) {
					controlGroup.get(v).enable();
				}
			});
		} else {
			controlGroup.get('comment').disable();
			listFormControls.map(v => {
				if (controlGroup.get(v)) {
					controlGroup.get(v).disable();
				}
			});
		}
	}

	makeAnswerIDUnRequiredinOtherPart(index) {
		(this.pdpForm.get('epi_disposition') as FormArray).controls[index].get('answer_id').setValidators(null);
		(this.pdpForm.get('epi_disposition') as FormArray).controls[index].get('answer_id').updateValueAndValidity(); // this is to rerun form validation after removing the validation for a field.
	}

	allowRisksFields(index, isDisabled) {
		const controlGroup = (this.pdpForm.get('cat_pdp_risques') as FormArray).controls[index];
		if (isDisabled) {
			controlGroup.get('comment').enable();
			controlGroup.get('is_eu').enable();
			controlGroup.get('is_piman').enable();
			controlGroup.get('is_sous_traitant').enable();
			controlGroup.get('other_cat_pdp_risque').enable();
			controlGroup.get('other_pdp_moyen_risque').enable();
			controlGroup.get('other_pdp_situation_risque').enable();
			if ((controlGroup.get('situation') as FormArray)) {
				(controlGroup.get('situation') as FormArray).controls.map(v => {
					v.get('answer').enable();
					v.get('comment').enable();
				});
			}
			if ((controlGroup.get('moyen') as FormArray)) {
				(controlGroup.get('moyen') as FormArray).controls.map(v => {
					v.get('answer').enable();
					v.get('comment').enable();
					// (v.get('items') as FormArray).controls.map(r => {
					// 	r.get('id').enable();
					// 	r.get('answer').enable();
					// 	r.get('comment').enable();
					// });
				});
			}
		} else {
			controlGroup.get('comment').disable();
			controlGroup.get('is_eu').disable();
			controlGroup.get('is_piman').disable();
			controlGroup.get('is_sous_traitant').disable();
			controlGroup.get('other_cat_pdp_risque').disable();
			controlGroup.get('other_pdp_moyen_risque').disable();
			controlGroup.get('other_pdp_situation_risque').disable();
			if ((controlGroup.get('situation') as FormArray)) {
				(controlGroup.get('situation') as FormArray).controls.map(v => {
					v.get('answer').disable();
					v.get('comment').disable();
				});

			}
			if ((controlGroup.get('moyen') as FormArray)) {
				(controlGroup.get('moyen') as FormArray).controls.map(v => {
					v.get('answer').disable();
					v.get('comment').disable();
				});
			}
		}

	}

	allowSubMoyensFields(control, isDisabled) {
		if (isDisabled) {
			if ((control.get('pdp_risque_moyen_filtre') as FormArray)) {
				(control.get('pdp_risque_moyen_filtre') as FormArray).controls.map(v => {
					v.get('answer').enable();
				});
			}
		} else {
			if ((control.get('pdp_risque_moyen_filtre') as FormArray)) {
				(control.get('pdp_risque_moyen_filtre') as FormArray).controls.map(v => {
					v.get('answer').disable();
				});
			}
		}
	}

	allowComment(control, isDisabled) {
		if (isDisabled) {
			control.get('comment').enable();
		} else {
			control.get('comment').disable();
		}
	}


	onAddSpecificValue(controlName: string, ArrayFormName, index, value) {
		const control = (this.pdpForm.get(ArrayFormName) as FormArray).controls[index].get(controlName);
		if (control) {
			control.setValue(value);
		}
	}

	manageCheckBoxSelection(id: number, checked: boolean, formArray: FormArray) {
		/* Selected */
		if (checked) {
			const group = new FormGroup({
				id: new FormControl(id),
				answer: new FormControl(1),
				answer_id: new FormControl(),
				type_operation: new FormControl(null),
				comment: new FormControl(null),
				is_eu: new FormControl(null),
				is_ee: new FormControl(null),
				is_sous_traitant: new FormControl(null),
			});
			formArray.push(group);
		} else {
			let i = 0;
			formArray.controls.forEach((ctrl: FormControl) => {
				if (ctrl.get('id').value === id) {
					formArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}


	onCheckBoxIsChecked(controlName: string, ArrayFormName, index = null) {
		const control = (this.pdpForm.get(ArrayFormName) as FormArray).controls[index].get(controlName);
		if (!control) {
			return false;
		}
		return control.value;
	}

	isValueInFormArray(formControlName, id) {
		return this.getControlsArrayFormName(formControlName).filter(v => v.get('id').value === id).length > 0;
	}

	addIntervenant() {
		if (this.intervenants.getValue().length < 9) {
			const group = new FormGroup({
				first_name: new FormControl('', Validators.required),
				last_name: new FormControl('', Validators.required),
				contact: new FormControl('', Validators.required),
				formations: new FormControl(null),
				is_suivi_medical: new FormControl(null),
				motif: new FormControl(null),
			});
			this.getControlsArrayFormName('intervenants').push(group);
			this.intervenants.next(this.getControlsArrayFormName('intervenants'));
		}
	}

	addSousTraitant() {
		const group = new FormGroup({
			name: new FormControl(''),
			mail: new FormControl('', Validators.email),
			tel: new FormControl(''),
		});
		this.getControlsArrayFormName('sous_traitant').push(group);
	}

	getControlsArrayFormName(formArrayName) {
		return (this.pdpForm.get(formArrayName) as FormArray).controls;
	}

	getFormArrayControls(array) {
		if (array) {
			return array.controls;
		}
		return [];
	}

	togglePartInspectionAt(event, index, FormArrayName, FormChangeToControlName) {
		this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).setValidators(event ? Validators.required : null);
		event ? this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).enable() : this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).disable()
		this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).updateValueAndValidity(); // this is to rerun form validation after removing the validation for a field.
	}

	formPathValues(pdp: Pdp) {
		if (pdp.is_presence_site_client) {
			this.pdpForm.get('presence_site_client_frequency_id').enable();
		}
		if (pdp.intervenants) {
			const intervenantsArray: FormArray = this.pdpForm.get('intervenants') as FormArray;
			intervenantsArray.controls.map((c: FormGroup) => {
				if (c.get('is_suivi_medical').value) {
					c.get('motif_id').enable();
					c.updateValueAndValidity();
				}
			});
		}
		if (pdp.pdp_consigne_ee) {
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
		}
		if (pdp.pdp_epi_disposition_ee) {
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
		}
		if (pdp.pdp_moyen_disposition_ee) {
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
		}
		if (pdp.pdp_travaux_dangereux) {
			const travauxDangereux: FormArray = this.pdpForm.get('travaux_dangereux') as FormArray;
			travauxDangereux.patchValue(pdp.pdp_travaux_dangereux.map(v => {
				return {
					id: v.travaux_dangereux_id,
					answer: v.answer
				};
			}));
		}
		if (pdp.pdp_answer_risques) {
			const risques: FormArray = this.pdpForm.get('cat_pdp_risques') as FormArray;
			const PdpRisques = pdp.pdp_answer_risques.map(v => {
				return {
					id: v.cat_pdp_risque_id,
					answer: v.answer,
					comment: v.comment,
					is_piman: v.is_piman,
					is_eu: v.is_eu,
					is_sous_traitant: v.is_sous_traitant,
					other_cat_pdp_risque: v.other_cat_pdp_risque,
					other_pdp_moyen_risque: v.other_pdp_moyen_risque !== null ? v.other_pdp_moyen_risque : [],
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
								};
							}),
						};
					})],
					situation: [...v.situation.map(m => {
						return {
							id: m.pdp_risque_id,
							answer: m.answer,
							comment: m.comment,
						};
					})]
				};
			});
			if (PdpRisques && PdpRisques.length > 0) {
				(this.pdpForm.get('cat_pdp_risques') as FormArray).patchValue(PdpRisques || []);
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
			}
		}
		if (pdp.pdp_validations) {
			const validationsArray: FormArray = this.pdpForm.get('validations') as FormArray;
			validationsArray.patchValue(pdp.pdp_validations.map(v => {
				return {
					company_name: v.company_name,
					full_name: v.full_name,
					validation_at: v.validation_at,
					type: v.type,
					is_part_inspection: v.is_part_inspection,
					part_inspection_at: v.part_inspection_at
				};
			}));
			validationsArray.controls.map((c: FormGroup) => {
				if (c.get('is_part_inspection').value) {
					c.get('part_inspection_at').enable();
					c.updateValueAndValidity();
				}
			});
		}
		this.pdpForm.updateValueAndValidity();
	}

}

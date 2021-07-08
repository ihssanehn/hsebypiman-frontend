import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormStatus} from "@app/core/_base/crud/models/form-status";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {take} from "rxjs/operators";
import {ConsigneModel, DispositionModel, PDPFrequences, RisqueModel, TraveauxDangereuxModel} from "@app/core/models";
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

	@Input() formStatus: FormStatus;
	@ViewChild('autosize', {static: true}) autosize: CdkTextareaAutosize;
	@Output() onLastStep: EventEmitter<any> = new EventEmitter<any>();
	public parts = [1];
	@Input() origin = 'add';

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
			{title: 'EU', need_text_area_in_title: true},
			{
				title: 'EE',
				need_text_area_in_title: false,
				company_name: 'PIMAN Consultants'
			},
			{title: 'Sous-traitant 1', need_text_area_in_title: true},
			{title: 'Sous-traitant 2', need_text_area_in_title: true},
		];
		if (this.validationPlan.length > 0) {
			const formArray = this.pdpForm.get('validations') as FormArray;
			for (let i = 0; i < this.validationPlan.length; i++) {
				const group = new FormGroup({
					title: new FormControl(this.validationPlan[i].title),
					need_text_area_in_title: new FormControl(this.validationPlan[i].need_text_area_in_title),
					company_name: new FormControl(this.validationPlan[i].company_name, Validators.required),
					full_name: new FormControl('', Validators.required),
					validation_at: new FormControl(null, Validators.required),
					type: new FormControl(this.validationPlan[i].title, Validators.required),
					is_part_inspection: new FormControl(null),
					part_inspection_at: new FormControl(null),
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
		this.frequences = res.result.data ? res.result.data.frequence : [];
		this.suivisMedicalIntervenants = res.result.data ? res.result.data.intervenant : [];

		if (this.EPIDispositionList.length > 0) {
			this.patchFormArray(this.EPIDispositionList, 'epi_disposition', [{
				name: 'answer_id',
				needTest: false,
				isRequired: true
			}, {name: 'is_eu', needTest: false}, {name: 'is_ee', needTest: false}, {
				name: 'is_sous_traitant',
				needTest: false
			}]);
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
			const formArray = this.pdpForm.get('risques') as FormArray;
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
		this.cdr.markForCheck();
	}

	patchFormArray(array, formArrayName, listAddedControls: Array<any> = [], testAtteName = null) {
		const FormArray = this.pdpForm.get(formArrayName) as FormArray;
		for (let i = 0; i < array.length; i++) {
			const group = new FormGroup({
				id: new FormControl(array[i].id),
				answer: new FormControl(false),
				comment: new FormControl({value: null, disabled: true}),
			});
			listAddedControls.map(v => {
				if (!v.needTest || (i && v.needTest && array[i].has_details)) {
					group.addControl(v.name, new FormControl({
						value: null,
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
		return this.pdpForm.get(controlName).value === '1';
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
		if (event.checked) {
			this.pdpForm.controls[controlName].setValue('1');
		} else {
			this.pdpForm.controls[controlName].setValue('0');
		}
	}


	onCheckBoxChange(event, FormControlName, value = null) {
		const formArray: FormArray = this.pdpForm.get(FormControlName) as FormArray;
		this.manageCheckBoxSelection(event.source.value || value, event.checked, formArray);

		console.log(this.pdpForm.get(FormControlName).value, event);
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

	allowRisksFields(index, isDisabled) {
		const controlGroup = (this.pdpForm.get('risques') as FormArray).controls[index];
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
		this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).updateValueAndValidity(); // this is to rerun form validation after removing the validation for a field.
	}
}

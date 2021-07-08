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
	public intervenants: Array<any> = [{last: '', first: '', contact: '', formations: '', suivis_médical: ''}];
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
			{company: 'EU', need_text_area_in_title: true},
			{
				company: 'EE',
				need_text_area_in_title: false,
				title: 'PIMAN Consultants'
			},
			{company: 'Sous-traitant 1', need_text_area_in_title: true},
			{company: 'Sous-traitant 2', need_text_area_in_title: true},
		];
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
				needTest: false
			}, {name: 'is_eu', needTest: false}, {name: 'is_ee', needTest: false}, {
				name: 'is_sous_traitant',
				needTest: false
			}]);
		}
		if (this.instructionsList.length > 0) {
			this.patchFormArray(this.instructionsList, 'consignes', [{
				name: 'type_operation',
				needTest: true
			}], 'has_details');
		}
		if (this.EESMoyenDisposition.length > 0) {
			this.patchFormArray(this.EESMoyenDisposition, 'moyen_disposition_ees', []);
		}
		// if (this.instructionsList.length > 0) {
		// 	this.patchFormArray(this.instructionsList, 'consignes', ['is_eu', 'is_ee', 'is_sous_traitant']);
		// }
		// if (this.instructionsList.length > 0) {
		// 	this.patchFormArray(this.instructionsList, 'consignes', ['is_eu', 'is_ee', 'is_sous_traitant']);
		// }

		console.log(this.pdpForm);
		this.cdr.markForCheck();
	}

	patchFormArray(array, formArrayName, listAddedControls: Array<any>, testAtteName = null) {
		const FormArray = this.pdpForm.get(formArrayName) as FormArray;
		for (let i = 0; i < array.length; i++) {
			const group = new FormGroup({
				id: new FormControl(array[i].id),
				answer: new FormControl(false),
				comment: new FormControl({value: null, disabled: true}),
			});
			listAddedControls.map(v => {
				if (!v.needTest || (i && v.needTest && array[i].has_details)) {
					console.log(formArrayName, v.name);
					group.addControl(v.name, new FormControl({value: null, disabled: true}));
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
		console.log(control, controlName, control.dirty, control.touched, control.hasError(validationType));
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

	// onAddSpecificValue(id, FormControlName, key, value) {
	// 	const formArray: FormArray = this.pdpForm.get(FormControlName) as FormArray;
	// 	console.log(value);
	// 	formArray.controls.forEach((ctrl: FormControl) => {
	// 		if (ctrl.get('id').value === id) {
	// 			ctrl.setValue({...ctrl.value, [key]: value});
	// 			return;
	// 		}
	// 	});
	// }

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
		if (this.intervenants.length < 9) {
			this.intervenants = [...this.intervenants, {}];
		}
	}

	getControlsArrayFormName(formArrayName) {
		return (this.pdpForm.get(formArrayName) as FormArray).controls;
	}
}

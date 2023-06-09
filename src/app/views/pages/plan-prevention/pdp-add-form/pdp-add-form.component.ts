import {
	ChangeDetectorRef,
	ViewChildren,
	Component,
	EventEmitter,
	Input,
	NgZone,
	QueryList,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import {
	ConsigneModel,
	DispositionModel,
	Pdp,
	PDPFrequences,
	RisqueModel,
	TraveauxDangereuxModel
} from '@app/core/models';
import {PdpService} from '@app/core/services';
import {BehaviorSubject} from 'rxjs';
import moment from 'moment';
import {NotifierService} from 'angular-notifier';
import {TranslateService} from '@ngx-translate/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';


@Component({
	selector: 'tf-pdp-add-form',
	templateUrl: './pdp-add-form.component.html',
	styleUrls: ['./pdp-add-form.component.scss']
})
export class PdpAddFormComponent implements OnInit {


	@Input('pdpForm')
	set pdpFormSetter(value) {
		if (value != null) {
			this.pdpForm = value;
			if (this.getControlsArrayFormName('validations')) {
				this.validations.next(this.getControlsArrayFormName('validations'));
			}
			if (this.getControlsArrayFormName('intervenants')) {
				this.intervenants.next(this.getControlsArrayFormName('intervenants'));
			}
		}
	}

	@Input() pdpType?: string;

	public _pdp: Pdp;

	@Input('_pdp')
	set pdpPatcher(value) {
		if (value != null) {
			this._pdp = value;
			// this.formPathValues(this._pdp);
		}
	}

	pdpForm: FormGroup;
	@ViewChildren("signaturePad") signaturePads: QueryList<SignaturePad>;
	private canvas: Object = {
		'minWidth': 0.5,
		'canvasWidth': 500,
		'canvasHeight': 150
	}
	public signaturePadOptions: Object = {
		'minWidth': this.canvas['minWidth'],
		'canvasWidth': this.canvas['canvasWidth'],
		'canvasHeight': this.canvas['canvasHeight'],
	};
	@Input() formStatus: FormStatus;
	@Input() adding = true;
	@ViewChild('autosize', {static: true}) autosize: CdkTextareaAutosize;
	@Output() onLastStep: EventEmitter<any> = new EventEmitter<any>();
	public parts = [1];
	public instructionsList: Array<ConsigneModel>;
	public defaultValues = null;
	public EPIDispositionList: Array<DispositionModel>;
	public EESMoyenDisposition: Array<DispositionModel>;
	public traveauxDangereux: Array<TraveauxDangereuxModel>;
	public validationPlan: Array<any> = [];
	public validations = new BehaviorSubject<AbstractControl[]>([]);
	public intervenants = new BehaviorSubject<AbstractControl[]>([]);
	public consultants: Array<any> = [];
	public suivisMedicalIntervenants: Array<any> = [{}];
	private risques: Array<RisqueModel>;
	public frequences: Array<PDPFrequences>;
	displayedColumnsConsignes: string[] = ['consignes', 'answers', 'comments'];
	displayedColumnsEPIDisposition: string[] = ['label', 'answers', 'list', 'type', 'comment'];
	displayedColumnsEESMoyenDisposition: string[] = ['label', 'answers', 'comments'];
	displayedColumnsTravaux: string[] = ['list', 'answers'];
	displayedColumnsValidationPlan: string[] = ['company', 'name', 'date', 'participation', 'visa', 'actions'];
	displayedColumnsIntervenants: string[] = ['intervenant_id', 'contact', 'formations', 'suivis_médical', 'actions'];
	dataSource = new BehaviorSubject<AbstractControl[]>([]);

	private readonly notifier: NotifierService;

	constructor(private _ngZone: NgZone,
				notifierService: NotifierService,
				private FB: FormBuilder,
				private translate: TranslateService,
				private cdr: ChangeDetectorRef,
				protected pdpService: PdpService) {
		this.notifier = notifierService;
	}

	async ngOnInit() {
		this.triggerResize();
		await this.getPDPConsignes();
		this.setDefaultValues();
		if (this._pdp != null) {
			this.formPathValues(this._pdp);
		}
		console.log(this.pdpForm);
	}

	setDefaultValues() {
		if (!this.pdpForm.get('raison_sociale_ee').value) {
			this.pdpForm.get('raison_sociale_ee').setValue(this.defaultValues.raison_sociale_ee);
		}
		if (!this.pdpForm.get('raison_sociale_tel_ee').value) {
			this.pdpForm.get('raison_sociale_tel_ee').setValue(this.defaultValues.raison_sociale_tel_ee);
		}
		if (!this.pdpForm.get('sauveteurs_secouriste_travail_ee').value) {
			this.pdpForm.get('sauveteurs_secouriste_travail_ee').setValue(this.defaultValues.sauveteurs_secouriste_travail_ee);
		}
		if (!this.pdpForm.get('cse_ee_name').value) {
			this.pdpForm.get('cse_ee_name').setValue(this.defaultValues.cse_ee_name);
		}
		if (!this.pdpForm.get('cse_ee_job').value) {
			this.pdpForm.get('cse_ee_job').setValue(this.defaultValues.cse_ee_job);
		}
		if (!this.pdpForm.get('cse_ee_tel').value) {
			this.pdpForm.get('cse_ee_tel').setValue(this.defaultValues.cse_ee_tel);
		}
		if (!this.pdpForm.get('hse_ee_name').value) {
			this.pdpForm.get('hse_ee_name').setValue(this.defaultValues.hse_ee_name);
		}
		if (!this.pdpForm.get('hse_ee_mail').value) {
			this.pdpForm.get('hse_ee_mail').setValue(this.defaultValues.hse_ee_mail);
		}
		if (!this.pdpForm.get('hse_ee_tel').value) {
			this.pdpForm.get('hse_ee_tel').setValue(this.defaultValues.hse_ee_tel);
		}
	}

	async getPDPConsignes() {
		const res: any = await this.pdpService.getAllPdpFilters().toPromise();
		this.instructionsList = res.result.data ? res.result.data.consignes : [];
		this.consultants = res.result.data ? res.result.data.consultants : [];
		this.defaultValues = res.result.data ? res.result.data.default_values : null;
		this.EPIDispositionList = res.result.data ? res.result.data.epi_disposition : [];
		this.EESMoyenDisposition = res.result.data ? res.result.data.moyen_disposition_ees : [];
		this.traveauxDangereux = res.result.data ? res.result.data.travaux_dangereux : [];

		if (this.pdpType == "PDP_PIMAN_BUREAU") {
			this.risques = res.result.data ? res.result.data.risquesByType[0].PDP_PIMAN_BUREAU : [];
		} else if (this.pdpType == "PDP_PIMAN_TERRAIN") {
			this.risques = res.result.data ? res.result.data.risquesByType[1].PDP_PIMAN_TERRAIN : [];
		}
		this.suivisMedicalIntervenants = res.result.data ? res.result.data.intervenant : [];
		this.frequences = res.result.data ? res.result.data.frequence : [];
		if (this.EPIDispositionList.length > 0) {
			this.patchFormArray(this.EPIDispositionList, 'epi_disposition', [{
				name: 'answer_id',
				needTest: false,
				isRequired: true
			}, {name: 'type', needTest: false, isRequired: true}
			]);
			// const index = this.EPIDispositionList.findIndex(v => v.items && v.items.length === 0);
			this.EPIDispositionList.map((_, i) => i).filter(e => this.EPIDispositionList[e].items && this.EPIDispositionList[e].items.length === 0).map(i  => this.makeAnswerIDUnRequiredinOtherPart(i));
			// if (index > -1) {
			// 	this.makeAnswerIDUnRequiredinOtherPart(index);
			// }
		}
		if (this.instructionsList.length > 0) {
			this.patchFormArray(this.instructionsList, 'consignes', [{
				name: 'type_operation',
				needTest: true,
			}]);
		}
		if (this.EESMoyenDisposition.length > 0) {
			this.patchFormArray(this.EESMoyenDisposition, 'moyen_disposition_ees', [], true);
		}
		if (this.traveauxDangereux.length > 0) {
			this.patchFormArray(this.traveauxDangereux, 'travaux_dangereux');
		}
		if (this.risques.length > 0) {

			const formArray = this.pdpForm.get('cat_pdp_risques') as FormArray;
			//Rest array in case of switching type of Pdp
			while (formArray.length !== 0) {
				formArray.removeAt(0)
			}

			for (let i = 0; i < this.risques.length; i++) {
				const group = new FormGroup({
					id: new FormControl(this.risques[i].id),
					label: new FormControl(this.risques[i].label),
					is_other: new FormControl(this.risques[i].is_other),
					is_required_situation: new FormControl(this.risques[i].is_required_situation),
					answer: new FormControl(this.risques[i].is_always_true || null),
					comment: new FormControl({value: null, disabled: true}),
					is_eu: new FormControl(this.risques[i].default_responsable && this.risques[i].default_responsable.indexOf('eu') > -1),
					is_piman: new FormControl(this.risques[i].default_responsable && this.risques[i].default_responsable.indexOf('piman') > -1),
					is_sous_traitant: new FormControl(this.risques[i].default_responsable && this.risques[i].default_responsable.indexOf('sous-traitant') > -1),
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
						is_title: new FormControl(v.is_title),
						is_with_comment: new FormControl(v.is_with_comment),
						label: new FormControl(v.label),
						answer: new FormControl(v.is_selected || null),
						comment: new FormControl({value: null, disabled: true})
					}));
				});
				this.risques[i].moyen.map(v => {
					(group.get('moyen') as FormArray).push(new FormGroup({
						id: new FormControl(v.id),
						is_title: new FormControl(v.is_title),
						is_with_comment: new FormControl(v.is_with_comment),
						label: new FormControl(v.label),
						answer: new FormControl(v.is_selected || null),
						comment: new FormControl({value: null, disabled: true}),
						pdp_risque_moyen_filtre: new FormArray(v.pdp_risque_moyen_filtre
							? v.pdp_risque_moyen_filtre.map(r => new FormGroup({
								id: new FormControl(r.id),
								is_with_comment: new FormControl(r.is_with_comment),
								answer: new FormControl({value: r.is_selected || null, disabled: !v.is_selected}),
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


	patchFormArray(array, formArrayName, listAddedControls: Array<any> = [], commentDisabled = true) {
		const FormArray = this.pdpForm.get(formArrayName) as FormArray;
		//Reset array in case of switching type of Pdp
		while (FormArray.length !== 0) {
			FormArray.removeAt(0)
		}
		for (let i = 0; i < array.length; i++) {
			const group = new FormGroup({
				id: new FormControl(array[i].id),
				answer: new FormControl(null, Validators.required),
				comment: new FormControl({value: '', disabled: commentDisabled}),
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
		if (this.checkPart(key)) {
			if (!this.parts.includes(key)) {
				this.parts.push(key);
			}
			if (key === 6) {
				this.onLastStep.emit(true);
			}
		} else {
			this.notifier.notify('error', this.translate.instant('PDP.NOTIF.ERROR_SUBMITTING'));

		}
	}

	checkPart(key) {
		// this.pdpForm.markAllAsTouched();
		switch (key) {
			case 2  : {
				this.markFirstStepTouched();
				return this.checkSecondPart();
			}
			case 3  : {
				this.markSecondStepTouched();
				return this.checkThirdPart();
			}
			case 4 : {
				this.markThirdStepTouched();
				return this.checkFourthPart();
			}
			case 5 : {
				this.markFourthStepTouched();
				return this.checkFifthPart();
			}
			case 6 : {
				return this.checkFifthPart() && this.getControlsArrayFormName('cat_pdp_risques').filter(v => this.checkIfSelectOnSituation(v) || this.checkIfCheckOneResp(v)).length === 0;
			}
		}
	}

	markFirstStepTouched() {
		this.pdpForm.get('raison_sociale_eu').markAsTouched();
		this.pdpForm.get('raison_sociale_tel_eu').markAsTouched();
		this.pdpForm.get('representant_entreprise_eu_name').markAsTouched();
		this.pdpForm.get('representant_entreprise_eu_mail').markAsTouched();
		this.pdpForm.get('representant_entreprise_eu_tel').markAsTouched();
		this.pdpForm.get('representant_entreprise_ee_mail').markAsTouched();
		this.pdpForm.get('sauveteurs_secouriste_travail').markAsTouched();
		this.pdpForm.get('label_intervention').markAsTouched();
		this.pdpForm.get('lieu_intervention').markAsTouched();
		this.pdpForm.get('pdp_intervention_at').markAsTouched();
		this.pdpForm.get('horaires_ouverture_site').markAsTouched();
		this.pdpForm.get('presence_site_client_frequency_id').markAsTouched();
		this.pdpForm.get('horaires_fermeture_site').markAsTouched();
	}

	markSecondStepTouched() {
		this.pdpForm.get('consignes').markAllAsTouched();
	}

	markThirdStepTouched() {
		this.pdpForm.get('epi_disposition').markAllAsTouched();
		this.pdpForm.get('moyen_disposition_ees').markAllAsTouched();
	}

	markFourthStepTouched() {
		this.pdpForm.get('travaux_dangereux').markAllAsTouched();
	}

	checkSecondPart() {
		return this.pdpForm.get('raison_sociale_eu').valid
			&& this.pdpForm.get('raison_sociale_tel_eu').valid
			&& this.pdpForm.get('representant_entreprise_eu_name').valid
			&& this.pdpForm.get('representant_entreprise_eu_mail').valid
			&& this.pdpForm.get('representant_entreprise_eu_tel').valid
			&& this.pdpForm.get('representant_entreprise_ee_mail').valid
			&& this.pdpForm.get('sauveteurs_secouriste_travail').valid
			&& this.pdpForm.get('label_intervention').valid
			&& this.pdpForm.get('lieu_intervention').valid
			&& this.pdpForm.get('pdp_intervention_at').valid
			&& this.pdpForm.get('horaires_ouverture_site').valid
			&& (this.pdpForm.get('presence_site_client_frequency_id').enabled ? this.pdpForm.get('presence_site_client_frequency_id').valid : true)
			&& this.pdpForm.get('horaires_fermeture_site').valid;
	}

	checkThirdPart() {
		return this.checkSecondPart() && this.pdpForm.get('consignes').valid;
	}

	checkFourthPart() {
		return this.checkThirdPart()
			&& this.pdpForm.get('epi_disposition').valid
			&& this.pdpForm.get('moyen_disposition_ees').valid;
		// && this.EPIDispositionList.filter((v: any, index: number) =>
		// 	this.isControlHasError('answer_id', 'required', 'epi_disposition', index)
		// 	|| this.isControlHasError('type', 'required', 'epi_disposition', index)).length === 0;
	}

	checkFifthPart() {
		return this.checkFourthPart() && this.pdpForm.get('travaux_dangereux').valid;
	}


	isFieldRequired(controlName) {
		if (this.pdpForm && this.pdpForm.controls[controlName]) {
			const control = this.pdpForm.controls[controlName];
			const {validator} = control;
			if (validator) {
				const validation = validator(new FormControl());
				return validation !== null && validation.required === true;
			}
		}
		return false;
	}

	isControlHasError(controlName: string, validationType: string, ArrayFormName = null, index = null): boolean {
		if (!this.pdpForm) {
			return false;
		}
		if (ArrayFormName && !(this.pdpForm.get(ArrayFormName) as FormArray).controls[index]) {
			return false
		}

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
		this.pdpForm.get('presence_site_client_frequency_id').setValidators(event.value ? Validators.required : null);
		event.value ? this.pdpForm.get('presence_site_client_frequency_id').enable() : this.pdpForm.get('presence_site_client_frequency_id').disable();
		this.pdpForm.get('presence_site_client_frequency_id').updateValueAndValidity();
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
			controlGroup.get('comment').setValue(null);
			listFormControls.map(v => {
				if (controlGroup.get(v)) {
					controlGroup.get(v).setValue(null);
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
		if (control.get('comment')) {
			if (isDisabled) {
				control.get('comment').enable();
			} else {
				control.get('comment').disable();
			}
		}
	}


	isValueInFormArray(formControlName, id) {
		return this.getControlsArrayFormName(formControlName).filter(v => v.get('id').value === id).length > 0;
	}

	addIntervenant() {
		if (this.intervenants.getValue().length < 9) {
			const group = new FormGroup({
				// first_name: new FormControl(''),
				// last_name: new FormControl(''),
				intervenant_id: new FormControl('', Validators.required),
				contact: new FormControl('', Validators.required),
				formations: new FormControl(null),
				is_suivi_medical: new FormControl(null),
				motif_id: new FormControl({value: null, disabled: true}),
				read_and_approved: new FormControl(false),
				signature: new FormControl(null)
			});
			(this.pdpForm.get('intervenants') as FormArray).push(group);
			this.intervenants.next(this.getControlsArrayFormName('intervenants'));
		}
	}

	addSousTraitant() {
		const group = new FormGroup({
			name: new FormControl(''),
			mail: new FormControl('', Validators.email),
			tel: new FormControl(''),
		});
		(this.pdpForm.get('sous_traitant') as FormArray).push(group);
	}

	addValidationSousTraitant() {
		const group = new FormGroup({
			need_text_area_in_title: new FormControl(true),
			title: new FormControl('Sous-traitant'),
			company_name: new FormControl(''),
			full_name: new FormControl(''),
			validation_at: new FormControl(null),
			type: new FormControl('st'),
			deletable: new FormControl(true),
			is_part_inspection: new FormControl(null),
			read_and_approved: new FormControl(false),
			signature: new FormControl(null),
			part_inspection_at: new FormControl({value: null, disabled: true}),
		});
		(this.pdpForm.get('validations') as FormArray).push(group);
		this.validations.next(this.getControlsArrayFormName('validations'));
	}

	deleteElemntInArray(index, formArrayName, array: BehaviorSubject<AbstractControl[]> = null) {
		(this.pdpForm.get(formArrayName) as FormArray).removeAt(index);
		if (array) {
			array.next(this.getControlsArrayFormName(formArrayName));
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
		event ? this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).enable() : this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).disable();
		this.getControlsArrayFormName(FormArrayName)[index].get(FormChangeToControlName).updateValueAndValidity(); // this is to rerun form validation after removing the validation for a field.
	}

	formPathValues(pdp: Pdp) {
		if (pdp.is_presence_site_client) {
			this.pdpForm.get('presence_site_client_frequency_id').enable();
		}
		if (pdp.intervenants) {
			const intervenantsArray: FormArray = this.pdpForm.get('intervenants') as FormArray;
			intervenantsArray.clear();
			pdp.intervenants.map(v => {
				intervenantsArray.push(this.FB.group({
					...v,
					intervenant_id: new FormControl(v.user_id || null, Validators.required),
					contact: new FormControl(v.contact || null, Validators.required),
					read_and_approved: v.signature ? !!v.signature.read_and_approved : null,
					signature: v.signature ? v.signature.signature : null,
				}));
			});
			intervenantsArray.controls.map((c: FormGroup) => {
				if (c.get('is_suivi_medical').value) {
					c.get('motif_id').enable();
					c.get('motif_id').setValidators(Validators.required);
				} else {
					c.get('motif_id').disable();
				}
				c.updateValueAndValidity();
			});
			console.log(intervenantsArray);
			this.intervenants.next(this.getControlsArrayFormName('intervenants'));
		}
		if (pdp.sous_traitant && pdp.sous_traitant.length > 0) {
			pdp.sous_traitant.map(v => {
				(this.pdpForm.get('sous_traitant') as FormArray).push(this.FB.group({
					...v
				}));
			});
		}
		if (pdp.pdp_consigne_ee) {
			const consignesArray: FormArray = this.pdpForm.get('consignes') as FormArray;
			// consignesArray.patchValue(pdp.pdp_consigne_ee.map(v => {
			// 	return {id: v.consigne_ee_id, answer: v.answer, type_operation: v.type_operation, comment: v.comment};
			// }));
			consignesArray.controls.map((c: FormGroup) => {
				const index = pdp.pdp_consigne_ee.findIndex(v => v.consigne_ee_id === c.get('id').value);
				if (index > -1) {
					c.patchValue({
						id: pdp.pdp_consigne_ee[index].consigne_ee_id,
						answer: pdp.pdp_consigne_ee[index].answer,
						type_operation: pdp.pdp_consigne_ee[index].type_operation,
						comment: pdp.pdp_consigne_ee[index].comment
					});
				}
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
			epiDispositionArray.controls.map((c: FormGroup) => {
				const index = pdp.pdp_epi_disposition_ee.findIndex(v => v.epi_disposition_ee_id === c.get('id').value);
				if (index > -1) {
					c.patchValue({
						id: pdp.pdp_epi_disposition_ee[index].epi_disposition_ee_id,
						answer: pdp.pdp_epi_disposition_ee[index].answer,
						answer_id: pdp.pdp_epi_disposition_ee[index].answer_id,
						type: pdp.pdp_epi_disposition_ee[index].type,
						comment: pdp.pdp_epi_disposition_ee[index].comment
					});
				}
				if (c.get('answer').value) {
					c.get('comment').enable();
					c.get('type').enable();
					// c.get('is_eu').enable();
					// c.get('is_sous_traitant').enable();
					if (c.get('answer_id')) {
						c.get('answer_id').enable();
					}
					c.updateValueAndValidity();
				}
			});
		}
		if (pdp.pdp_moyen_disposition_ee) {
			const moyenDisposition: FormArray = this.pdpForm.get('moyen_disposition_ees') as FormArray;
			moyenDisposition.controls.map((c: FormGroup) => {
				const index = pdp.pdp_moyen_disposition_ee.findIndex(v => v.moyen_disposition_ee_id === c.get('id').value);
				if (index > -1) {
					c.patchValue({
						id: pdp.pdp_moyen_disposition_ee[index].moyen_disposition_ee_id,
						answer: pdp.pdp_moyen_disposition_ee[index].answer,
						comment: pdp.pdp_moyen_disposition_ee[index].comment
					});
				}
				if (c.get('answer').value) {
					c.get('comment').enable();
					c.updateValueAndValidity();
				}
			});
		}
		if (pdp.pdp_travaux_dangereux) {
			const travauxDangereux: FormArray = this.pdpForm.get('travaux_dangereux') as FormArray;
			travauxDangereux.controls.map((c: FormGroup) => {
				const index = pdp.pdp_travaux_dangereux.findIndex(v => v.travaux_dangereux_id === c.get('id').value);
				if (index > -1) {
					c.patchValue({
						id: pdp.pdp_travaux_dangereux[index].travaux_dangereux_id,
						answer: pdp.pdp_travaux_dangereux[index].answer,
					});
				}
			});
		}
		if (pdp.pdp_answer_risques) {
			const risques: FormArray = this.pdpForm.get('cat_pdp_risques') as FormArray;
			// const PdpRisques = pdp.pdp_answer_risques.map(v => {
			// 	return {
			// 		id: v.cat_pdp_risque_id,
			// 		answer: v.answer,
			// 		comment: v.comment,
			// 		is_piman: v.is_piman,
			// 		is_eu: v.is_eu,
			// 		is_sous_traitant: v.is_sous_traitant,
			// 		other_cat_pdp_risque: v.other_cat_pdp_risque,
			// 		other_pdp_moyen_risque: v.other_pdp_moyen_risque !== null ? v.other_pdp_moyen_risque : [],
			// 		other_pdp_situation_risque: v.other_pdp_situation_risque,
			// 		moyen: [...v.moyens.map(m => {
			// 			return {
			// 				id: m.pdp_risque_id,
			// 				answer: m.answer,
			// 				comment: m.comment,
			// 				pdp_risque_moyen_filtre: m.moyen_filter.map(mf => {
			// 					return {
			// 						id: mf.pdp_risque_moyen_filter_id,
			// 						answer: mf.answer,
			// 						comment: mf.comment,
			// 					};
			// 				}),
			// 			};
			// 		})],
			// 		situation: [...v.situation.map(m => {
			// 			return {
			// 				id: m.pdp_risque_id,
			// 				answer: m.answer,
			// 				comment: m.comment,
			// 			};
			// 		})]
			// 	};
			// });
			if (pdp.pdp_answer_risques && pdp.pdp_answer_risques.length > 0) {
				// this.pdpForm.setControl('cat_pdp_risques', this.FB.array(PdpRisques || []));
				// (this.pdpForm.get('cat_pdp_risques') as FormArray).patchValue(PdpRisques)
				risques.controls.map((c: FormGroup) => {
					const index = pdp.pdp_answer_risques.findIndex(v => v.cat_pdp_risque_id === c.get('id').value);
					if (index > -1) {
						c.patchValue({
							id: pdp.pdp_answer_risques[index].cat_pdp_risque_id,
							answer: pdp.pdp_answer_risques[index].answer,
							comment: pdp.pdp_answer_risques[index].comment,
							is_piman: pdp.pdp_answer_risques[index].is_piman,
							is_eu: pdp.pdp_answer_risques[index].is_eu,
							is_sous_traitant: pdp.pdp_answer_risques[index].is_sous_traitant,
							other_cat_pdp_risque: pdp.pdp_answer_risques[index].other_cat_pdp_risque,
							other_pdp_moyen_risque: pdp.pdp_answer_risques[index].other_pdp_moyen_risque !== null ? pdp.pdp_answer_risques[index].other_pdp_moyen_risque : [],
							other_pdp_situation_risque: pdp.pdp_answer_risques[index].other_pdp_situation_risque
						});
						(c.get('moyen') as FormArray).controls.map(m => {
							const i = c.get('moyen').value.findIndex(v => v.pdp_risque_id === m.get('id').value);
							if (i > -1) {
								m.patchValue({
									id: c.get('moyen').value[i].pdp_risque_id,
									answer: c.get('moyen').value[i].answer,
									comment: c.get('moyen').value[i].comment,
								});
								(m.get('pdp_risque_moyen_filtre') as FormArray).controls.map(s => {
									const si = m.get('pdp_risque_moyen_filtre').value.findIndex(v => v.pdp_risque_moyen_filter_id === m.get('id').value);
									if (si > -1) {
										s.patchValue({
											id: m.get('pdp_risque_moyen_filtre').value[si].pdp_risque_moyen_filter_id,
											answer: m.get('pdp_risque_moyen_filtre').value[si].answer,
											comment: m.get('pdp_risque_moyen_filtre').value[si].comment,
										});
									}
								});
							}

						});
						(c.get('situation') as FormArray).controls.map(m => {
							const i = c.get('situation').value.findIndex(v => v.pdp_risque_id === m.get('id').value);
							if (i > -1) {
								m.patchValue({
									id: c.get('situation').value[i].pdp_risque_id,
									answer: c.get('situation').value[i].answer,
									comment: c.get('situation').value[i].comment,
								});
							}
						});
					}

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
					part_inspection_at: v.part_inspection_at,
					read_and_approved: v.signature ? !!v.signature.read_and_approved : null,
					signature: v.signature ? v.signature.signature : null,
				};
			}));
			pdp.pdp_validations.map((v: any, index: number) => {
				if (v.type === 'st' && index > 1) {
					(this.pdpForm.get('validations') as FormArray).push(this.FB.group({
						...v,
						need_text_area_in_title: true,
						title: 'Sous-traitant',
						deletable: true,
						read_and_approved: v.signature ? !!v.signature.read_and_approved : null,
						signature: v.signature ? v.signature.signature : null,
					}));
				}
			});
			validationsArray.controls.map((c: FormGroup) => {
				if (c.get('is_part_inspection').value) {
					c.get('part_inspection_at').enable();
					c.updateValueAndValidity();
				}
			});
			this.validations.next(this.getControlsArrayFormName('validations'));
		}
		this.pdpForm.updateValueAndValidity();
	}

	checkIfSelectOnSituation(risk: AbstractControl) {
		return risk.get('answer').value
			&& risk.get('is_required_situation').value
			&& (risk.get('situation') as FormArray).controls.filter(v => v.get('answer').value).length === 0;
	}


	checkIfCheckOneResp(risk: AbstractControl) {
		return risk.get('answer').value && (!risk.get('is_eu').value && !risk.get('is_piman').value && !risk.get('is_sous_traitant').value);
	}


	checkIfDateLastIsBigger() {
		return moment(this.pdpForm.get('horaires_fermeture_site').value, 'hh:mm').isAfter(moment(this.pdpForm.get('horaires_ouverture_site').value, 'hh:mm'));
	}

	clearSignature(index) {
		let signaturePadChild = this.signaturePads.filter((element, i) => index === i);
		if (signaturePadChild && signaturePadChild.length > 0) {
			signaturePadChild[0].clear();
		}
		(this.pdpForm.get('validations') as FormArray).controls[index].get('signature').setValue(null);
	}

	resizeSignaturePad() {
		var ratio = Math.max(window.devicePixelRatio || 1, 1);
		this.signaturePads.forEach((child) => {
			child.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
		});
	}


	drawComplete(index: number) {
		let signaturePadChild = this.signaturePads.filter((element, i) => i === index);
		(this.pdpForm.get('validations') as FormArray).controls[index].get('signature').setValue(signaturePadChild[0].toDataURL());
	}

	changeEpiDispositionAnswerID(e, i) {
		const iE = this.EPIDispositionList[i].items.filter(v => v.id === e);
		const control = (this.pdpForm.get('epi_disposition') as FormArray).controls[i].get('comment');
		if (iE && iE.length > 0) {
			control.setValidators(iE[0].is_with_comment ? Validators.required : null);
			control.updateValueAndValidity();
		}
	}
}

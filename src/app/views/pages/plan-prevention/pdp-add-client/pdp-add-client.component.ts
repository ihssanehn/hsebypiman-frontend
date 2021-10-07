
import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
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
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';

@Component({
	selector: 'tf-pdp-add-client',
	templateUrl: './pdp-add-client.component.html',
	styleUrls: ['./pdp-add-client.component.scss']
  })
export class PdpAddClientComponent implements OnInit {

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

	@Input() uploader: FileUploader;
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
	public validations = new BehaviorSubject<AbstractControl[]>([]);
	public intervenants = new BehaviorSubject<AbstractControl[]>([]);
	public suivisMedicalIntervenants: Array<any> = [{}];
	private risques: Array<RisqueModel>;

	public frequences: Array<PDPFrequences>;
	displayedColumnsConsignes: string[] = ['consignes', 'answers', 'comments'];
	displayedColumnsEPIDisposition: string[] = ['label', 'answers', 'list', 'type', 'comment'];
	displayedColumnsEESMoyenDisposition: string[] = ['label', 'answers', 'comments'];
	displayedColumnsTravaux: string[] = ['list', 'answers'];
	displayedColumnsValidationPlan: string[] = ['company', 'name', 'date', 'participation', 'visa', 'actions'];
	displayedColumnsIntervenants: string[] = ['last', 'first', 'contact', 'formations', 'suivis_médical', 'actions'];
	edit: false;


	dataSource = new BehaviorSubject<AbstractControl[]>([]);

	private readonly notifier: NotifierService;

	constructor(private _ngZone: NgZone,
				notifierService: NotifierService,
				private FB: FormBuilder,
				private translate: TranslateService,
				private cdr: ChangeDetectorRef,
				protected pdpService: PdpService
				) {
		this.notifier = notifierService;
	}

	ngOnInit() {
		this.triggerResize();

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
				answer: new FormControl(null),
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
			if (key === 3) {
				this.onLastStep.emit(true);
			}
		} else {
			this.notifier.notify('error', this.translate.instant('PDP.NOTIF.ERROR_SUBMITTING'));

		}
	}

	checkPart(key) {
		this.pdpForm.markAllAsTouched();
		console.log(key);
		switch (key) {
			case 2  : {
				return this.checkSecondPart();
			}
			case 3  : {
				return this.checkSecondPart();
			}
			case 4 : {
				return this.checkFourthPart();
			}
			case 5 : {
				return this.checkFourthPart();
			}
			case 6 : {
				return this.checkFourthPart() && this.getControlsArrayFormName('cat_pdp_risques').filter(v => this.checkIfSelectOnSituation(v) || this.checkIfCheckOneResp(v)).length === 0;
			}
		}
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

	checkFourthPart() {
		return this.checkSecondPart()
			&& this.EPIDispositionList.filter((v: any, index: number) =>
				this.isControlHasError('answer_id', 'required', 'epi_disposition', index)
				|| this.isControlHasError('type', 'required', 'epi_disposition', index)).length === 0;
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
		console.log('hanzaz', event, this.pdpForm.get('presence_site_client_frequency_id'));
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
				first_name: new FormControl('', Validators.required),
				last_name: new FormControl('', Validators.required),
				contact: new FormControl('', Validators.required),
				formations: new FormControl(null),
				is_suivi_medical: new FormControl(null),
				motif_id: new FormControl({value: null, disabled: true}),
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

	addValidationSousTraitant() {
		const group = new FormGroup({
			need_text_area_in_title: new FormControl(true),
			title: new FormControl('Sous-traitant'),
			company_name: new FormControl(''),
			full_name: new FormControl(''),
			validation_at: new FormControl(null),
			type: new FormControl('ss'),
			deletable: new FormControl(true),
			is_part_inspection: new FormControl(null),
			part_inspection_at: new FormControl({value: null, disabled: true}),
		});
		this.getControlsArrayFormName('validations').push(group);
		this.validations.next(this.getControlsArrayFormName('validations'));
		console.log(this.getControlsArrayFormName('validations'));
	}

	deleteElemntInArray(index, formArrayName, array: BehaviorSubject<AbstractControl[]> = null) {
		this.getControlsArrayFormName(formArrayName).splice(index, 1);
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
				(this.pdpForm.get('intervenants') as FormArray).push(this.FB.group({...v}));
			});
			intervenantsArray.controls.map((c: FormGroup) => {
				c.get('is_suivi_medical').value ? c.get('motif_id').enable() : c.get('motif_id').disable();
				c.updateValueAndValidity();
			});
			this.intervenants.next(this.getControlsArrayFormName('intervenants'));
		}
		if (pdp.sous_traitant && pdp.sous_traitant.length > 0) {
			pdp.sous_traitant.map(v => {
				(this.pdpForm.get('sous_traitant') as FormArray).push(this.FB.group({
					...v
				}));
			});
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

	deleteDoc(item){
		Swal.fire({
		  icon: 'warning',
		  title: this.translate.instant("REMONTEES.NOTIF.DOC_DELETE_CONFIRMATION.TITLE"),
		  html: '<p>'+this.translate.instant("REMONTEES.NOTIF.DOC_DELETE_CONFIRMATION.LABEL")+'</p>',
		  showConfirmButton: true,
		  showCancelButton: true,
		  cancelButtonText: this.translate.instant("ACTION.CANCEL"),
		  confirmButtonText: this.translate.instant("ACTION.CONFIRM"),
		}).then(async response => {
		  if (response.value) {
		// 	this.documentService.delete(item.id).toPromise()
		// 	.then((res) => {
		// 	  this.cdr.markForCheck();
		// 	  var docArray = this.remonteeForm.get('documents') as FormArray;
		// 	  docArray.removeAt(docArray.value.findIndex(x => x.id === item.id))
		// 	  Swal.fire({
		// 		icon: 'success',
		// 		title: this.translate.instant("REMONTEES.NOTIF.DOC_DELETED.TITLE"),
		// 		showConfirmButton: false,
		// 		timer: 1500,
		// 	  })
		//    })
		  }
		});
	  }

	  seeItem(item){
		return item.file.name
	  }

	  onFileDrop(event){
		var extensions = ['pdf'];

		for (let i = 0; i < event.length; i++) {

		  const droppedFile = event[i];
		  var name = droppedFile.name.split('.');
		  var ext = name[name.length -1].toLowerCase();

		  let error = false;

		  if( extensions.indexOf(ext) == -1 ){
			error = true;
			Swal.fire({
			  icon: 'error',
			  title: this.translate.instant('UPLOAD.EXTENSION')+' '+droppedFile.name,
			  showConfirmButton: false,
			  timer: 1500
			});
		  } else if (droppedFile.size > 4000000) {
			error = true;
			Swal.fire({
			  icon: 'error',
			  title: this.translate.instant('UPLOAD.SIZE')+' '+droppedFile.name,
			  showConfirmButton: false,
			  timer: 1500
			});
		  }

		  if(error == true){
			this.uploader.queue = this.uploader.queue.filter(x=>x.file.name != droppedFile.name);
		  }
		}

	  }
}

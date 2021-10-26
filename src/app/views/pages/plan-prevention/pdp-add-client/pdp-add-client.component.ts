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
import {DocumentService, PdpService} from '@app/core/services';
import {BehaviorSubject} from 'rxjs';
import moment from 'moment';
import {NotifierService} from 'angular-notifier';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
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
			// this.formPathValues(this._pdp);
			// this.subPDPFormValidator();
		}
	}

	@Input() uploader: FileUploader;
	@Input() formStatus: FormStatus;
	@Input() adding;
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
	public defaultValues = null;
	private risques: Array<RisqueModel>;

	public frequences: Array<PDPFrequences>;
	displayedColumnsConsignes: string[] = ['consignes', 'answers', 'comments'];
	displayedColumnsEPIDisposition: string[] = ['label', 'answers', 'list', 'type', 'comment'];
	displayedColumnsEESMoyenDisposition: string[] = ['label', 'answers', 'comments'];
	displayedColumnsTravaux: string[] = ['list', 'answers'];
	displayedColumnsValidationPlan: string[] = ['company', 'name', 'date', 'participation', 'visa', 'actions'];
	displayedColumnsIntervenants: string[] = ['last', 'first', 'contact', 'formations', 'suivis_médical', 'actions'];


	dataSource = new BehaviorSubject<AbstractControl[]>([]);

	private readonly notifier: NotifierService;

	constructor(private _ngZone: NgZone,
				notifierService: NotifierService,
				private FB: FormBuilder,
				private translate: TranslateService,
				private cdr: ChangeDetectorRef,
				protected pdpService: PdpService,
				private documentService: DocumentService
	) {
		this.notifier = notifierService;
	}

	async ngOnInit() {
		this.triggerResize();
		await this.getPDPConsignes();
		this.setDefaultValues();
		if (this._pdp != null) {
			this.formPathValues(this._pdp);
		}
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
		this.suivisMedicalIntervenants = res.result.data ? res.result.data.intervenant : [];
		this.frequences = res.result.data ? res.result.data.frequence : [];
		this.defaultValues = res.result.data ? res.result.data.default_values : null;
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
		if (this.checkPart()) {
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

	checkPart() {
		this.markFirstStepTouched();
		return this.checkSecondPart();
		// this.pdpForm.markAllAsTouched();
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


	makePresenceSiteClientRequired(event) {
		this.pdpForm.get('presence_site_client_frequency_id').setValidators(event.value ? Validators.required : null);
		event.value ? this.pdpForm.get('presence_site_client_frequency_id').enable() : this.pdpForm.get('presence_site_client_frequency_id').disable();
		this.pdpForm.get('presence_site_client_frequency_id').updateValueAndValidity();
		console.log('hanzaz', event, this.pdpForm.get('presence_site_client_frequency_id'));
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

	deleteElemntInArray(index, formArrayName, array: BehaviorSubject<AbstractControl[]> = null) {
		this.getControlsArrayFormName(formArrayName).splice(index, 1);
		if (array) {
			array.next(this.getControlsArrayFormName(formArrayName));
		}
	}

	getControlsArrayFormName(formArrayName) {
		return (this.pdpForm.get(formArrayName) as FormArray).controls;
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

	checkIfDateLastIsBigger() {
		return moment(this.pdpForm.get('horaires_fermeture_site').value, 'hh:mm').isAfter(moment(this.pdpForm.get('horaires_ouverture_site').value, 'hh:mm'));
	}

	deleteDoc(item) {
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("REMONTEES.NOTIF.DOC_DELETE_CONFIRMATION.TITLE"),
			html: '<p>' + this.translate.instant("REMONTEES.NOTIF.DOC_DELETE_CONFIRMATION.LABEL") + '</p>',
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("ACTION.CONFIRM"),
		}).then(async response => {
			if (response.value) {
				this.documentService.delete(item.id).toPromise()
					.then((res: any) => {
						this.cdr.markForCheck();
						this._pdp.documents = this._pdp.documents.filter((p) => p.id !== parseInt(res.result.data));
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("REMONTEES.NOTIF.DOC_DELETED.TITLE"),
							showConfirmButton: false,
							timer: 1500,
						})
					})
			}
		});
	}

	seeItem(item) {
		return item.file.name
	}

	onFileDrop(event) {
		var extensions = ['pdf'];

		for (let i = 0; i < event.length; i++) {

			const droppedFile = event[i];
			var name = droppedFile.name.split('.');
			var ext = name[name.length - 1].toLowerCase();

			let error = false;

			if (extensions.indexOf(ext) == -1) {
				error = true;
				Swal.fire({
					icon: 'error',
					title: this.translate.instant('UPLOAD.EXTENSION') + ' ' + droppedFile.name,
					showConfirmButton: false,
					timer: 1500
				});
			} else if (droppedFile.size > 4000000) {
				error = true;
				Swal.fire({
					icon: 'error',
					title: this.translate.instant('UPLOAD.SIZE') + ' ' + droppedFile.name,
					showConfirmButton: false,
					timer: 1500
				});
			}

			if (error == true) {
				this.uploader.queue = this.uploader.queue.filter(x => x.file.name != droppedFile.name);
			}
		}

	}
}

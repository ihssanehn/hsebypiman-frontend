import {ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {FormStatus} from "@app/core/_base/crud/models/form-status";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {take} from "rxjs/operators";
import {ConsigneModel, DispositionModel, RisqueModel, TraveauxDangereuxModel} from "@app/core/models";
import {PdpService} from "@app/core/services";

@Component({
	selector: 'tf-pdp-add-form',
	templateUrl: './pdp-add-form.component.html',
	styleUrls: ['./pdp-add-form.component.scss']
})
export class PdpAddFormComponent implements OnInit {

	@Input() pdpForm: FormGroup;
	@Input() formStatus: FormStatus;
	@ViewChild('autosize', {static: true}) autosize: CdkTextareaAutosize;
	public parts = [1];
	@Input() origin = 'add';

	public instructionsList: Array<ConsigneModel>;
	public EPIDispositionList: Array<DispositionModel>;
	public EESMoyenDisposition: Array<DispositionModel>;
	public traveauxDangereux: Array<TraveauxDangereuxModel>;
	public validationPlan: Array<any> = [];
	public risques: Array<RisqueModel>;
	displayedColumnsConsignes: string[] = ['consignes', 'comments'];
	displayedColumnsEPIDisposition: string[] = ['label', 'list', 'eu', 'ee', 'sous-traitant'];
	displayedColumnsEESMoyenDisposition: string[] = ['label', 'comments'];
	displayedColumnsTravaux: string[] = ['list'];
	displayedColumnsValidationPlan: string[] = ['company', 'name', 'date', 'participation', 'visa'];

	constructor(private _ngZone: NgZone,
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
		]
	}

	async getPDPConsignes() {
		const res: any = await this.pdpService.getAllPdpFilters().toPromise();
		this.instructionsList = res.result.data ? res.result.data.consignes : [];
		this.EPIDispositionList = res.result.data ? res.result.data.epi_disposition : [];
		this.EESMoyenDisposition = res.result.data ? res.result.data.moyen_disposition_ees : [];
		this.traveauxDangereux = res.result.data ? res.result.data.travaux_dangereux : [];
		this.risques = res.result.data ? res.result.data.risques : [];
		this.cdr.markForCheck();
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
		// if (key == 4) {
		// 	this.onLastStep.emit(true);
		// }
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

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.pdpForm.controls[controlName];
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

	manageCheckBoxSelection(id: number, checked: boolean, formArray: FormArray) {
		/* Selected */
		if (checked) {
			// Add a new control in the arrayForm
			formArray.push(new FormControl(id));
		} else {
			// find the unselected element
			let i = 0;

			formArray.controls.forEach((ctrl: FormControl) => {
				if (ctrl.value === id) {
					// Remove the unselected element from the arrayForm
					formArray.removeAt(i);
					return;
				}

				i++;
			});
		}
	}


	onCheckBoxIsChecked(formControlName, riskId) {
		return this.pdpForm.get(formControlName).value.includes(riskId);
	}

}

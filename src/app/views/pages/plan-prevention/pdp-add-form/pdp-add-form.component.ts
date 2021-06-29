import {ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {FormStatus} from "@app/core/_base/crud/models/form-status";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {take} from "rxjs/operators";
import {CatRisque, ConsigneModel} from "@app/core/models";
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
	displayedColumns: string[] = ['consignes', 'comments'];

	constructor(private _ngZone: NgZone,
				private cdr: ChangeDetectorRef,
				protected pdpService: PdpService) {
	}

	ngOnInit() {
		this.triggerResize();
		this.getPDPConsignes();
	}

	async getPDPConsignes() {
		const res: any = await this.pdpService.getAllPdpFilters().toPromise();
		console.log(res);
		this.instructionsList = res.result.data ? res.result.data.consignes : [];
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


	onRiskCheckChange(event, actions) {
		const risksFormArray: FormArray = this.pdpForm.get('risques') as FormArray;
		const catRisksformArray: FormArray = this.pdpForm.get('cat_risques') as FormArray;

		this.manageRisksSelection(event.source.value, event.checked, catRisksformArray);

		actions.forEach(element => {
			this.manageRisksSelection(element.id, event.checked, risksFormArray);
		});
	}

	manageRisksSelection(idRisk: number, checked: boolean, formArray: FormArray) {
		/* Selected */
		if (checked) {
			// Add a new control in the arrayForm
			formArray.push(new FormControl(idRisk));
		}
		/* unselected */
		else {
			// find the unselected element
			let i: number = 0;

			formArray.controls.forEach((ctrl: FormControl) => {
				if (ctrl.value == idRisk) {
					// Remove the unselected element from the arrayForm
					formArray.removeAt(i);
					return;
				}

				i++;
			});
		}
	}


	onRiskIsChecked(riskId) {
		return this.pdpForm.get('cat_risques').value.includes(riskId);
	}

}

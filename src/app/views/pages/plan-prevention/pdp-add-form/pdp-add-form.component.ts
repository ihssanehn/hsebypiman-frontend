import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormStatus} from "@app/core/_base/crud/models/form-status";

@Component({
	selector: 'tf-pdp-add-form',
	templateUrl: './pdp-add-form.component.html',
	styleUrls: ['./pdp-add-form.component.scss']
})
export class PdpAddFormComponent implements OnInit {

	@Input() pdpForm: FormGroup;
	@Input() formStatus: FormStatus;

	public parts = [1];
	@Input() origin: string = 'add';

	constructor() {
	}

	ngOnInit() {
	}

	partHided(key) {
		return !this.parts.includes(key);
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
}

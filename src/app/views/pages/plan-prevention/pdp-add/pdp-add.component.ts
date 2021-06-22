import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
	selector: 'tf-pdp-add',
	templateUrl: './pdp-add.component.html',
	styleUrls: ['./pdp-add.component.scss']
})
export class PdpAddComponent implements OnInit {

	pdpForm: FormGroup;

	constructor() {
	}

	ngOnInit() {
	}

}

import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: 'tf-pdp-admin-add-modal',
	templateUrl: './pdp-admin-add-modal.component.html',
	styleUrls: ['./pdp-admin-add-modal.component.scss']
})
export class PdpAdminAddModalComponent implements OnInit {

	title = '...';

	label = '';
	active = true;
	is_with_comment = true;

	constructor(public activeModal: NgbActiveModal) {
	}

	ngOnInit() {
	}

	async submit() {
		this.activeModal.close({libelle: this.label, label: this.label, active : this.active, is_comment_consigne : this.is_with_comment});
	}
}

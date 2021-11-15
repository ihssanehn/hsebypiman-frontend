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
	active = 1;
	is_with_comment = 0;

	showCommentOption = true;

	isPdpRiskCategory = false;
	isPdpRisk = false;
	pdpRiskCategoryAddedAttr = {
		is_always_true: 0,
		is_required_situation: 0,
		default_responsable: []
	};

	pdpRiskAddedAttr = {
		type: 'moyen',
		is_title: 0,
		is_selected: 0,
	};

	constructor(public activeModal: NgbActiveModal) {
	}

	ngOnInit() {
	}

	async submit() {
		let result: any = {libelle: this.label, label: this.label, active: this.active};
		if (this.showCommentOption) {
			result = {...result, is_comment_consigne: this.is_with_comment, is_with_comment: this.is_with_comment}
		}
		if (this.isPdpRiskCategory) {
			result = {...result, ...this.pdpRiskCategoryAddedAttr};
		}
		if (this.isPdpRisk) {
			result = {...result, ...this.pdpRiskAddedAttr};
		}
		this.activeModal.close(result);
	}

	toggleResponsable(value) {
		if (this.pdpRiskCategoryAddedAttr.default_responsable) {
			const i = this.pdpRiskCategoryAddedAttr.default_responsable.indexOf(value);
			i > -1 ? this.pdpRiskCategoryAddedAttr.default_responsable.splice(i, 1) : this.pdpRiskCategoryAddedAttr.default_responsable.push(value);
		} else {
			this.pdpRiskCategoryAddedAttr.default_responsable = [value];
		}
	}

	isChecked(value) {
		if (this.pdpRiskCategoryAddedAttr.default_responsable) {
			return this.pdpRiskCategoryAddedAttr.default_responsable.indexOf(value) > -1;
		}
	}
}

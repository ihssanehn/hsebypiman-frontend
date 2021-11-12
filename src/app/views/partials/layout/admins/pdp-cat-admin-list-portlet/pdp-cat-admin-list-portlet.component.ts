import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {PdpAdminAddModalComponent} from "@app/views/partials/layout/admins/pdp-admin-add-modal/pdp-admin-add-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";

@Component({
	selector: 'tf-pdp-cat-admin-list-portlet',
	templateUrl: './pdp-cat-admin-list-portlet.component.html',
	styleUrls: ['./pdp-cat-admin-list-portlet.component.scss']
})
export class PdpCatAdminListPortletComponent implements OnInit {

	@Input()
	item: any;

	@Input()
	sortable: boolean = true;

	@Output()
	onSaveItem = new EventEmitter<any>();

	@Output()
	onRefreshItem = new EventEmitter<any>();

	@Output()
	onDeleteItem = new EventEmitter<any>();

	@Output()
	onAddChild = new EventEmitter<any>();

	@Output()
	onSaveChild = new EventEmitter<any>();

	@Output()
	onDeleteChild = new EventEmitter<any>();

	@Output()
	onUpdateOrders = new EventEmitter<any>();

	collapsed: boolean = false;
	selectedItem;

	constructor(private modalService: NgbModal, private translate: TranslateService) {
	}

	ngOnInit() {
	}


	saveItem(data: any): void {
		console.log('before edit ', data);
		this.onSaveItem.emit(data);
	}

	refreshItem(data: any): void {
		this.onRefreshItem.emit(data);
	}


	deleteItem(data: any): void {
		this.onDeleteItem.emit(data);
	}


	addChild() {
		const modalRef: any = this.modalService.open(PdpAdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (this.translate.instant('PDP.ACTION.ADD_PDP_RISQUE') || '...');
		modalRef.componentInstance.showCommentOption = true;
		modalRef.componentInstance.isPdpRisk = true;
		modalRef.result.then(payload => payload ? this.onAddChild.emit({
			...payload,
			cat_pdp_risque_id: this.item.id
		}) : null);
		// this.item.children.push({edit: true})
		// this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(10);

	}

	saveChild(data: any): void {
		if (!data.id)
			this.onAddChild.emit({...data, parent_id: this.item.id});
		else
			this.onSaveChild.emit(data);
		data.edit = false;
	}

	saveOrders(data: any): void {
		if (data.length > 0)
			this.onUpdateOrders.emit(data);
	}

	deleteChild(data: any): void {
		this.onDeleteChild.emit({...data, parent_id: this.item.id});
	}

	dropChild(event: CdkDragDrop<string[]>): void {
		if (this.sortable) {
			let data = {id: event.item.data.id, ordre: event.currentIndex};
			moveItemInArray(this.item.children, event.previousIndex, event.currentIndex);

			var newOrders = [];
			for (let i = 0; i < this.item.children.length; i++) {
				const _data = this.item.children[i]
				if (_data.id) {
					newOrders.push({id: _data.id, ordre: i, libelle: _data.libelle});
				}
			}

			this.saveOrders(newOrders);
		}
	}


	startEdit(data: any): void {
		// data.old_activ = data.active;
		// data.edit = true;
		const modalRef: any = this.modalService.open(PdpAdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = data.label;
		modalRef.componentInstance.label = data.label;
		modalRef.componentInstance.active = data.active;
		modalRef.componentInstance.pdpRiskCategoryAddedAttr = {
			is_always_true: data.is_always_true,
			is_required_situation: data.is_required_situation,
			default_responsable: data.default_responsable
		};
		modalRef.componentInstance.showCommentOption = false;
		modalRef.componentInstance.isPdpRiskCategory = true;
		modalRef.result.then(payload => payload ? this.saveItem({...payload, id: data.id}) : null);
	}

	cancelEdit(data: any): void {
		if (data.id >= 0) {
			data.edit = false;
			data.libelle = data.old_lib;
			data.active = data.old_activ;
		} else {
			var idx = this.item.children.map(function (x) {
				return x.id;
			}).indexOf(data.id);
			this.item.children.splice(idx, 1);
		}
	}


	toggleVisibility(item) {
		if (item.active == 1) {
			item.active = 0;
		} else {
			item.active = 1
		}
		;
	}

}

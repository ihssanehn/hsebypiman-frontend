import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {NzTableComponent} from 'ng-zorro-antd';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
	selector: 'tf-admin-basic-list-portlet',
	templateUrl: './admin-basic-list-portlet.component.html',
	styleUrls: ['./admin-basic-list-portlet.component.scss']
})
export class AdminBasicListPortletComponent implements OnInit {

	@Input()
	items: any;

	@Input()
	sortable: boolean = true;

	@Input()
	addedColumns: any;

	@Output()
	onSaveItem = new EventEmitter<any>();

	@Output()
	onRefreshItem = new EventEmitter<any>();

	@Output()
	onDeleteItem = new EventEmitter<any>();

	@Output()
	onUpdateOrders = new EventEmitter<any>();

	collapsed: boolean = false;

	constructor() {
	}

	ngOnInit() {
	}


	saveItem(data: any): void {
		this.onSaveItem.emit(data);
		data.edit = false;
	}


	saveOrders(data: any): void {
		if (data.length > 0)
			this.onUpdateOrders.emit(data);
	}

	refreshItem(data: any): void {
		this.onRefreshItem.emit(data);
	}


	deleteItem(data: any): void {
		this.onDeleteItem.emit(data);
	}

	dropItem(event: CdkDragDrop<string[]>): void {
		if (this.sortable) {
			let _dataIdx = this.items.findIndex(item => item.id === event.item.data.id);
			let _data = {...this.items[_dataIdx]};
			_data.ordre = event.currentIndex;
			// let data = { id : event.item.data.id, ordre :  event.currentIndex };
			moveItemInArray(this.items, event.previousIndex, event.currentIndex);

			var newOrders = [];
			for (let i = 0; i < this.items.length; i++) {
				const _data = this.items[i]
				if (_data.id) {
					newOrders.push({id: _data.id, ordre: i, libelle: _data.libelle});
				}
			}

			this.saveOrders(newOrders);
		}
	}


	startEdit(data: any): void {
		data.old = data.libelle;
		data.edit = true;
	}

	cancelEdit(data: any): void {
		data.edit = false;
		data.libelle = data.old;
	}

	toggleVisibility(item) {
		if (item.active == 1) {
			item.active = 0;
		} else {
			item.active = 1
		}
		;
	}

	generateParentOrdre() {
		return this.items.length;
	}
}

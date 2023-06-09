import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ChangeDetectorRef,
	Injector
} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AdminAddModalComponent} from '../admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'tf-admin-template',
	template: ''
})
export class AdminTemplateComponent implements OnInit {

	cdr: ChangeDetectorRef;
	modalService: NgbModal;
	titleService: any;
	parentService: any;
	childService: any;
	translate: TranslateService;

	tpl: any = {
		title: 'Titre',
		deletedMessage: "NOTIF.ELEMENT_NOT_DELETED.LABEL",
		deletedChildMessage: "NOTIF.ELEMENT_NOT_DELETED.SUBLABEL",
		collapsed: false,
		canUpdateTitle: false,
		titleOject: null,
		childCol: 12,
	}

	list: any[];

	@Output()
	onConfirmDeletTitle = new EventEmitter<any>();

	constructor(injector: Injector) {
	}

	ngOnInit() {
		this.getList();
	}

	initChildren(item) {
		item['children'] = [];
		return item;
	}

	formatChildren(item) {
	}

	async getList(params = {}) {
		try {
			var res = await this.parentService.getAllAsAdmin(params).toPromise();
			this.list = res.result.data.map(item => this.formatChildren(item));
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	refreshList() {
		this.getList();
	}

	async addItem(title?, appends?, up = true, withImage = false) {
		const modalRef = this.modalService.open(AdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (title || '...');
		modalRef.componentInstance.withImage = withImage;
		modalRef.result.then((payload) => {
			if (payload) {
				this.createItem(payload, appends, up)
			}
		}, (reason) => {

		});
	}

	async createItem(payload, appends?, up = true) {
		if (payload) {
			try {
				var created = await this.parentService.create({...payload, ...appends}).toPromise();
				created = this.initChildren(created);
				up ? this.list.unshift(created) : this.list.push(created);
				this.cdr.markForCheck();
			} catch (error) {
				console.error(error);
			}
		}
	}

	async saveItem(item) {
		try {
			var updated = await this.parentService.update(item).toPromise();
			const index = this.list.findIndex(type => type.id === updated.id);
			this.list[index] = {...this.list[index], ...updated};
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async getItem({id}) {
		try {
			var item = await this.parentService.get(id).toPromise();
			const index = this.list.findIndex(item => item.id === id);
			this.list[index] = this.formatChildren(item);
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async deleteItem({id}, confirm?: any) {
		try {
			await this.parentService.delete(id)
				.toPromise()
				.then((res: any) => {
					Swal.fire({
						icon: 'success',
						title: (confirm ? confirm.title : '...'),
						showConfirmButton: false,
						timer: 1500
					})
					const index = this.list.findIndex(item => item.id === id);
					this.list.splice(index, 1);
				})
				.catch(err => {

					Swal.fire({
						icon: 'error',
						title: this.tpl.deletedMessage,
						showConfirmButton: false,
						timer: 3000
					});

				});

			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async addChild(payload) {
		try {
			await this.childService.create(payload).toPromise();
			this.getItem({id: payload.parent_id});
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async updateChild(item) {
		try {
			await this.childService.update(item).toPromise();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async updateOrders(datas) {
		try {
			await this.childService.updateOrders(datas).toPromise();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async deleteChild({id, parent_id}, confirm?: any) {
		try {
			await this.childService.delete(id)
				.toPromise()
				.then((res: any) => {
					Swal.fire({
						icon: 'success',
						title: (confirm ? confirm.title : '...'),
						showConfirmButton: false,
						timer: 1500
					})
					this.getItem({id: parent_id});
				})
				.catch(err => {

					Swal.fire({
						icon: 'error',
						title: this.tpl.deletedChildMessage,
						showConfirmButton: false,
						timer: 3000
					});

				});


			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	// BACK TODO
	generateCode(str) {
		return str.replace(/\s/g, '').toUpperCase();
	}

	// BACK TODO
	generateOrdre(item_id) {
		const index = this.list.findIndex(item => item.id === item_id);
		return this.list[index].children.length;
	}

	generateParentOrdre() {
		return this.list.length
	}

	async editTitle() {
		const modalRef = this.modalService.open(AdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (this.tpl.title || '...');
		modalRef.componentInstance.label = (this.tpl.title || '...');
		modalRef.result.then(payload => this.updateTitle(payload), payload => this.updateTitle(payload));
	}

	async updateTitle(payload = null,) {
		if (this.tpl.titleObject && payload) {
			this.tpl.titleObject.libelle = payload.libelle;
			try {
				await this.titleService.update(this.tpl.titleObject).toPromise();
				this.tpl.title = payload.libelle;
				this.cdr.markForCheck();
			} catch (error) {
				console.error(error);
			}
		}

	}

	async deleteTitle(confirm?: any) {
		if (this.tpl.titleObject) {
			Swal.fire({
				icon: 'warning',
				title: this.translate.instant("NOTIF.FORM_DELETE_CONFIRMATION.TITLE"),
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.DELETE")
			}).then(async response => {
				if (response.value) {
					this.onConfirmDeletTitle.emit(this.tpl.titleObject);
				}
			});

		}
	}
}

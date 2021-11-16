import {AfterViewInit, ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {PdpCategoryTypeService} from "@app/core/services";
import {AdminTemplateComponent} from "@app/views/partials/layout/admin-template/admin-template.component";
import {AdminAddModalComponent} from "@app/views/partials/layout/admin-add-modal/admin-add-modal.component";
import {PdpAdminAddModalComponent} from "@app/views/partials/layout/admins/pdp-admin-add-modal/pdp-admin-add-modal.component";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import Swal from "sweetalert2";

@Component({
	selector: 'tf-pdp-risques-type',
	templateUrl: './pdp-risques-type.component.html',
	styleUrls: ['./pdp-risques-type.component.scss']
})
export class PdpRisquesTypeComponent extends AdminTemplateComponent implements OnInit {

	cdr: ChangeDetectorRef;
	modalService: NgbModal;
	parentService: any;
	translate: TranslateService;

	tpl: any;

	list: any[];
	staticLst: any[];
	listAllCategories: Array<any> = [];

	@Input() title: string;
	@Input() typeId: number;

	@Input()
	set listAllCategoriesRisk(value: Array<any>) {
		if (value && value.length > 0) {
			this.listAllCategories = value;
		}
	}

	constructor(injector: Injector) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.parentService = injector.get(PdpCategoryTypeService);
		this.modalService = injector.get(NgbModal);
		this.translate = injector.get(TranslateService);
	}

	ngOnInit() {
		super.ngOnInit();
		this.refreshTranslations();
		this.tpl = {
			title: this.translate.instant('PDP.CARD.CATEGORIE_PDP_RISQUE.SHORTTITLE'),
			deletedMessage: this.translate.instant('PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE'),
			deletedChildMessage: this.translate.instant('PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE'),
			collapsed: true,
			canUpdateTitle: false,
			titleOject: null,
			childCol: 12
		};
	}

	refreshTranslations() {
		this.translate.stream('PDP.CARD.CATEGORIE_PDP_RISQUE.SHORTTITLE').subscribe(x => {
			this.tpl.title = x;
		});
		this.translate.stream('PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE').subscribe(x => {
			this.tpl.deletedMessage = x;
		});
		this.translate.stream('PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE').subscribe(x => {
			this.tpl.deletedChildMessage = x;
		});
	}


	async getList() {
		try {
			var res = await this.parentService.getAllAsAdmin({type_id: this.typeId}).toPromise();
			this.list = res.result.data ? res.result.data : [];
			this.staticLst = [...this.list];
			this.refreshAddingList();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	refreshAddingList() {
		if (this.staticLst && this.staticLst.length > 0) {
			this.listAllCategories = this.listAllCategories.filter(o1 => !this.staticLst.some(o2 => o1.id === o2.id));
		}
	}

	async addItem() {
		const modalRef = this.modalService.open(PdpAdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (this.translate.instant('PDP.ACTION.ADD_PDP_CAT_TYPE') || '...');
		modalRef.componentInstance.isPdpCategoryRiskByType = true;
		modalRef.componentInstance.showCommentOption = false;
		modalRef.componentInstance.showActiveOption = false;
		modalRef.componentInstance.showLabelOption = false;
		modalRef.componentInstance.pdpCategoriesToChooseWith = [...this.listAllCategories];
		modalRef.result.then(payload => this.createItem(payload, {type_id: this.typeId}, false), payload => this.createItem(payload, {type_id: this.typeId}, false));
	}

	async deleteItem(cate) {
		try {
			await this.parentService.delete({category_id: cate.id, type_id: this.typeId})
				.toPromise()
				.then((res: any) => {
					Swal.fire({
						icon: 'success',
						title: this.translate.instant('PDP.NOTIF.CATEGORIE_PDP_RISQUE_ARCHIVED.TITLE'),
						showConfirmButton: false,
						timer: 1500
					});
					const index = this.list.findIndex(item => item.id === cate.id);
					this.listAllCategories.push(this.list[index]);
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


	async createItem(payload, appends?, up = true) {
		if (payload) {
			try {
				await this.parentService.create({...payload, ...appends}).toPromise();
				this.getList();
				this.cdr.markForCheck();
			} catch (error) {
				console.error(error);
			}
		}
	}
}

import {ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {AdminTemplateComponent} from "@app/views/partials/layout/admin-template/admin-template.component";
import { PdpTypeService} from "@app/core/services";
import {PdpAdminAddModalComponent} from "@app/views/partials/layout/admins/pdp-admin-add-modal/pdp-admin-add-modal.component";

@Component({
	selector: 'tf-pdp-type',
	templateUrl: './pdp-type.component.html',
	styleUrls: ['./pdp-type.component.scss']
})
export class PdpTypeComponent extends AdminTemplateComponent implements OnInit {


	cdr: ChangeDetectorRef;
	modalService: NgbModal;
	parentService: any;
	childService: any;
	translate: TranslateService;


	tpl: any;

	@Input() list: any[];

	@Input() title: string;

	constructor(injector: Injector) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.modalService = injector.get(NgbModal);
		this.parentService = injector.get(PdpTypeService);
		this.translate = injector.get(TranslateService);
	}

	ngOnInit() {
		this.refreshTranslations();
		this.tpl = {
			title: this.translate.instant("PDP.CARD.TYPE.SHORTTITLE"),
			deletedMessage: this.translate.instant("PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
			deletedChildMessage: this.translate.instant("PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE"),
			collapsed: true,
			canUpdateTitle: false,
			titleOject: null,
			childCol: 12
		}
	}

	refreshTranslations() {
		this.translate.stream("PDP.CARD.TYPE.SHORTTITLE").subscribe(x => {
			this.tpl.title = x;
		});
		this.translate.stream("PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE").subscribe(x => {
			this.tpl.deletedMessage = x;
		});
		this.translate.stream("PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE").subscribe(x => {
			this.tpl.deletedChildMessage = x;
		});
	}


	async getList() {
		try {
			var res = await this.parentService.getAllAsAdmin().toPromise();
			this.list = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async addItem() {
		const modalRef: any = this.modalService.open(PdpAdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (this.translate.instant('PDP.ACTION.ADD_TYPE') || '...');
		modalRef.componentInstance.showCommentOption = false;
		modalRef.result.then(payload => this.createItem(payload, {
			ordre: this.generateParentOrdre(),
			color: '#000'
		}, false), payload => this.createItem(payload, {ordre: this.generateParentOrdre(), color: '#000'}, false));
	}

	async deleteItem({id}) {
		super.deleteItem({id}, {title: this.translate.instant("PDP.NOTIF.TYPE_ARCHIVED.TITLE")});
	}

}

import {ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {AdminTemplateComponent} from '@app/views/partials/layout/admin-template/admin-template.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {MoyenDispositionService} from '@app/core/services';
import {PdpAdminAddModalComponent} from "@app/views/partials/layout/admins/pdp-admin-add-modal/pdp-admin-add-modal.component";

@Component({
	selector: 'tf-pdp-moyen-disposition',
	templateUrl: './pdp-moyen-disposition.component.html',
	styleUrls: ['./pdp-moyen-disposition.component.scss']
})
export class PdpMoyenDispositionComponent extends AdminTemplateComponent implements OnInit {

	cdr: ChangeDetectorRef;
	modalService: NgbModal;
	parentService: any;
	childService: any;
	translate: TranslateService;


	tpl: any;

	list: any[];
	@Input() title: string;

	constructor(injector: Injector) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.modalService = injector.get(NgbModal);
		this.parentService = injector.get(MoyenDispositionService);
		this.translate = injector.get(TranslateService);

	}

	ngOnInit() {
		super.ngOnInit();
		this.refreshTranslations();
		this.tpl = {
			title: this.translate.instant('PDP.CARD.MOYEN_DISPOSITION_EES.SHORTTITLE'),
			deletedMessage: this.translate.instant('PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE'),
			deletedChildMessage: this.translate.instant('PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE'),
			collapsed: true,
			canUpdateTitle: false,
			titleOject: null,
			childCol: 12
		};
	}

	refreshTranslations() {
		this.translate.stream('PDP.CARD.MOYEN_DISPOSITION_EES.SHORTTITLE').subscribe(x => {
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
			const res = await this.parentService.getAllAsAdmin('moyen_disposition_ees').toPromise();
			this.list = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async addItem() {
		const modalRef = this.modalService.open(PdpAdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (this.translate.instant('PDP.ACTION.ADD_MOYEN_DISPOSITION') || '...');
		modalRef.result.then(payload => this.createItem(payload, {ordre: this.generateParentOrdre()}, false), payload => this.createItem(payload, {ordre: this.generateParentOrdre()}, false));
	}

	async deleteItem({id}) {
		super.deleteItem({id}, {title: this.translate.instant('PDP.NOTIF.MOYEN_DISPOSITION_ARCHIVED.TITLE')});
	}

	async updateOrders(datas) {
		try {
			await this.parentService.updateOrders({data: datas, type: 'moyen_disposition_ees'}).toPromise();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

}

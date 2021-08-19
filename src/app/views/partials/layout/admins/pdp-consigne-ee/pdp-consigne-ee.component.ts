import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ConsigneEEService, TravauxDangereuxService} from "@app/core/services";
import {AdminTemplateComponent} from "@app/views/partials/layout/admin-template/admin-template.component";

@Component({
	selector: 'tf-pdp-consigne-ee',
	templateUrl: './pdp-consigne-ee.component.html',
	styleUrls: ['./pdp-consigne-ee.component.scss']
})
export class PdpConsigneEeComponent extends AdminTemplateComponent implements OnInit {

	cdr: ChangeDetectorRef;
	modalService: NgbModal;
	parentService: any;
	childService: any;
	translate: TranslateService;


	tpl: any;

	list: any[];

	constructor(injector: Injector) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.modalService = injector.get(NgbModal);
		this.parentService = injector.get(ConsigneEEService);
		this.translate = injector.get(TranslateService);
	}

	ngOnInit() {
		super.ngOnInit();
		this.refreshTranslations();
		this.tpl = {
			title: this.translate.instant("PDP.CARD.CONSIGNE.SHORTTITLE"),
			deletedMessage: this.translate.instant("PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
			deletedChildMessage: this.translate.instant("PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE"),
			collapsed: true,
			canUpdateTitle: false,
			titleOject: null,
			childCol: 12
		}
	}

	refreshTranslations() {
		this.translate.stream("PDP.CARD.CONSIGNE.SHORTTITLE").subscribe(x => {
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
			var res = await this.parentService.getAllAsAdmin('consigne_ee').toPromise();
			this.list = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async addItem() {
		await super.addItem(this.translate.instant("PDP.ACTION.ADD_CONSIGNE"), {
			ordre: this.generateParentOrdre(),
			active: 1
		}, false);
	}

	async deleteItem({id}) {
		super.deleteItem({id}, {title: this.translate.instant("PDP.NOTIF.CONSIGNE_ARCHIVED.TITLE")});
	}

	async updateOrders(datas) {
		try {
			await this.parentService.updateOrders({data: datas, type: 'consigne_ees'}).toPromise();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}
}

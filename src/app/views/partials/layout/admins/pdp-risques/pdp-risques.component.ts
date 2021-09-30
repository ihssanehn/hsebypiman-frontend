import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PdpRisquesService} from '@app/core/services';
import {TranslateService} from '@ngx-translate/core';
import {AdminTemplateComponent} from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
	selector: 'tf-pdp-risques',
	templateUrl: './pdp-risques.component.html',
	styleUrls: ['./pdp-risques.component.scss']
})
export class PdpRisquesComponent extends AdminTemplateComponent implements OnInit {

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
		this.parentService = injector.get(PdpRisquesService);
		this.translate = injector.get(TranslateService);
	}

	ngOnInit() {
		super.ngOnInit();
		this.refreshTranslations();
		this.tpl = {
			title: this.translate.instant('PDP.CARD.PDP_RISK.SHORTTITLE'),
			deletedMessage: this.translate.instant('PDP.NOTIF.ELEMENT_NOT_DELETED.TITLE'),
			deletedChildMessage: this.translate.instant('PDP.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE'),
			collapsed: true,
			canUpdateTitle: false,
			titleOject: null,
			childCol: 12
		};
	}

	refreshTranslations() {
		this.translate.stream('PDP.CARD.PDP_RISK.SHORTTITLE').subscribe(x => {
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
			const res = await this.parentService.getAllAsAdmin('pdp_risques').toPromise();
			this.list = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async addItem() {
		await super.addItem(this.translate.instant('PDP.ACTION.ADD_PDP_RISQUE'), {
			ordre: this.generateParentOrdre(),
			active: 1
		}, false);
	}

	async deleteItem({id}) {
		super.deleteItem({id}, {title: this.translate.instant('PDP.NOTIF.PDP_RISQUE_ARCHIVED.TITLE')});
	}

	async updateOrders(datas) {
		try {
			await this.parentService.updateOrders({data: datas, type: 'pdp_risques'}).toPromise();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

}

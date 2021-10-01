import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {AdminTemplateComponent} from '@app/views/partials/layout/admin-template/admin-template.component';
import {CatPdpRisquesService} from '@app/core/services';

@Component({
	selector: 'tf-pdp-cat-risques',
	templateUrl: './pdp-cat-risques.component.html',
	styleUrls: ['./pdp-cat-risques.component.scss']
})
export class PdpCatRisquesComponent extends AdminTemplateComponent implements OnInit {

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
		this.parentService = injector.get(CatPdpRisquesService);
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
			const res = await this.parentService.getAllAsAdmin('cat_pdp_risques').toPromise();
			this.list = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	async addItem() {
		await super.addItem(this.translate.instant('PDP.ACTION.ADD_CATEGORIE_PDP_RISQUE'), {
			ordre: this.generateParentOrdre(),
			active: 1
		}, false);
	}

	async deleteItem({id}) {
		super.deleteItem({id}, {title: this.translate.instant('PDP.NOTIF.CATEGORIE_PDP_RISQUE_ARCHIVED.TITLE')});
	}

	async updateOrders(datas) {
		try {
			await this.parentService.updateOrders({data: datas, type: 'cat_pdp_risques'}).toPromise();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}
}

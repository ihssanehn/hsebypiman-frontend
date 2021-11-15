import {ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {PdpRisquesService, PdpService} from "@app/core/services";
import {AdminTemplateComponent} from "@app/views/partials/layout/admin-template/admin-template.component";

@Component({
  selector: 'tf-pdp-risques-type',
  templateUrl: './pdp-risques-type.component.html',
  styleUrls: ['./pdp-risques-type.component.scss']
})
export class PdpRisquesTypeComponent extends AdminTemplateComponent implements OnInit {

	cdr: ChangeDetectorRef;
	modalService: NgbModal;
	translate: TranslateService;

	tpl: any;

	list: any[];

	@Input() title: string;
	@Input() index: number;

	constructor(injector: Injector, private pdpService: PdpService) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.modalService = injector.get(NgbModal);
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
			const res = await this.pdpService.getAllPdpFilters().toPromise();
			this.list = res.result.data ? (res.result.data as any).risquesByType[this.index] : [];
			this.list = this.list.map(v => {
				return {...v, children: [...v.moyen, ...v.situation]};
			});
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

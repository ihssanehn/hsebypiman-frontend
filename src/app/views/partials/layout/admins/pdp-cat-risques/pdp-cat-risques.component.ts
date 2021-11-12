import {ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {AdminTemplateComponent} from '@app/views/partials/layout/admin-template/admin-template.component';
import {CatPdpRisquesService, PdpRisquesService, PdpService} from '@app/core/services';
import {PdpAdminAddModalComponent} from "@app/views/partials/layout/admins/pdp-admin-add-modal/pdp-admin-add-modal.component";

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

	@Input() title: string;

	constructor(injector: Injector, private pdpService: PdpService,
	) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.modalService = injector.get(NgbModal);
		this.parentService = injector.get(CatPdpRisquesService);
		this.childService = injector.get(PdpRisquesService);
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
			const res = await this.pdpService.getAllPdpFilters().toPromise();
			this.list = res.result.data ? (res.result.data as any).risques : [];
			this.list = this.list.map(v => {
				return {...v, children: [...v.moyen, ...v.situation]};
			});
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}


	async addItem() {
		const modalRef: any = this.modalService.open(PdpAdminAddModalComponent, {centered: true});
		modalRef.componentInstance.title = (this.translate.instant('PDP.ACTION.ADD_CATEGORIE_PDP_RISQUE') || '...');
		modalRef.componentInstance.showCommentOption = false;
		modalRef.componentInstance.isPdpRiskCategory = true;
		modalRef.result.then(payload => this.createItem(payload, {ordre: this.generateParentOrdre()}, false), payload => this.createItem(payload, {ordre: this.generateParentOrdre()}, false));
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

	async getItem({id}) {
		try {
			const item = await this.parentService.get(id).toPromise();
			const index = this.list.findIndex(v => v.id === id);
			// todo : need to be more refreshed
			this.list[index] = {...item, children: [...this.list[index].moyen, ...this.list[index].situation]};
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}

	}

	async addChild(payload) {
		try {
			await this.childService.create(payload).toPromise();
			this.getItem({id: payload.cat_pdp_risque_id});
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}
}

import {Component, OnInit} from '@angular/core';
import {CatPdpRisquesService, PdpTypeService} from "@app/core/services";

@Component({
	selector: 'tf-pdp-admin',
	templateUrl: './pdp-admin.component.html',
	styleUrls: ['./pdp-admin.component.scss']
})
export class PdpAdminComponent implements OnInit {

	typeLoading = false;
	catRiskLoading = false;
	listPDPTypes: any[];
	listCategoriesRisks: any[];
	terrainTypeID: number = null;
	bureauTypeID: number = null;

	constructor(private pdpTypeService: PdpTypeService, private pdpCateRiskService: CatPdpRisquesService) {
	}

	ngOnInit() {
		this.getList();
		this.getListCategories();
	}


	async getList() {
		try {
			this.typeLoading = true;
			const res = await this.pdpTypeService.getAllAsAdmin().toPromise();
			this.listPDPTypes = res.result.data;
			if (this.listPDPTypes && this.listPDPTypes.length > 0) {
				const b = this.listPDPTypes.findIndex(v => v.code === 'PDP_PIMAN_BUREAU');
				const t = this.listPDPTypes.findIndex(v => v.code === 'PDP_PIMAN_TERRAIN');
				this.bureauTypeID = b > -1 ? this.listPDPTypes[b].id : null;
				this.terrainTypeID = t > -1 ? this.listPDPTypes[t].id : null;
			}
			this.typeLoading = false;
		} catch (error) {
			console.error(error);
			this.typeLoading = false;
		}
	}

	async getListCategories() {
		try {
			this.catRiskLoading = true;
			const res2 = await this.pdpCateRiskService.getAllAsAdmin().toPromise();
			this.listCategoriesRisks = res2.result.data;
			this.listCategoriesRisks = this.listCategoriesRisks.map(v => {
				return {...v, children: [...v.moyen, ...v.situation]};
			});
			this.catRiskLoading = false;
		} catch (e) {
			console.error(e);
			this.catRiskLoading = false;
		}
	}

	refreshListCategories(e: Array<any>) {
		this.listCategoriesRisks = [...e];
	}

}

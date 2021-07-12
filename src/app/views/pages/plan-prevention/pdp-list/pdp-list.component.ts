import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {Pdp} from '@app/core/models';
import {ActivatedRoute, Router} from '@angular/router';
import {ArService, PdpService} from '@app/core/services';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'tf-pdp-list',
	templateUrl: './pdp-list.component.html',
	styleUrls: ['./pdp-list.component.scss']
})
export class PdpListComponent implements OnInit {

	public pdpsList: Paginate<Pdp>;
	pagination: any = {
		page: 1,
		last_page: 1,
		total: 10,
		pageSize: 10,
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: ['created_at'],
		order_way: 'desc',
		keyword: '',
	};
	showFilters = false;
	displayedArColumns = ['raison_sociale_eu', 'cse', 'cse_eu_tel', 'created_at', 'effectif_moyen', 'label_intervention', 'lieu_intervention', 'pdp_intervention_at', 'action'];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected pdpService: PdpService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {
	}

	ngOnInit() {
		this.getPDPs();
	}

	async getPDPs() {
		try {
			let res = await this.pdpService.getAll(this.filter).toPromise();
			this.pdpsList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.pdpsList.total,
				page: this.pdpsList.current_page,
				last_page: this.pdpsList.last_page
			};
			this.filter.page = this.pagination.page;
			this.filter.per_page = this.pagination.pageSize;
			if (!this.cdr['destroyed']) {
				this.cdr.detectChanges();
			}
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	changePagination() {
		this.pagination = {
			...this.pagination,
			pageSize: this.pagination.pageSize,
			total: this.pagination.total,
			last_page: this.pagination.last_page
		};
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getPDPs();
	}

	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay();
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getPDPs();
	}

	toggleOrderWay() {
		if (this.filter.order_way === 'asc') {
			this.filter.order_way = 'desc';
		} else {
			this.filter.order_way = 'asc';
		}
	}

	isOrderedBy(by) {
		if (Array.isArray(by)) {
			return JSON.stringify(by) === JSON.stringify(this.filter.order_by);
		} else {
			return by === this.filter.order_by;
		}
	}

	advancedSearchChanged($event) {
		this.showFilters = $event;
	}

	udpateFilters(filters) {
		for (let [key, value] of Object.entries(filters)) {
			this.filter[key] = value;
		}
		this.getPDPs();
	}

	exportList() {
		const filters = {...this.filter};
		filters.type = "EXCEL";
		return this.pdpService.export(filters);
	}
}

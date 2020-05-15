import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { VisiteService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Visite } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-visites-list',
	templateUrl: './visites-list.component.html',
	styleUrls: ['./visites-list.component.scss']
})
export class VisitesListComponent implements OnInit {

	public visitesList: Paginate < Visite > ;
	visite_id: number;
	showFilters: boolean = false;
	pagination: any = {
		page: 1,
		total: 10,
    pageSize: 10,
    last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: 'visite_securites.date_visite',
		order_way: 'asc',
		keyword: "",
		dateRange: [],
		status_id: "",
		params: []
	};
	displayedVisiteColumns = ['code','client','type', 'redacteur', 'visite', 'date_visite', 'status', 'action'];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected visiteService: VisiteService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
		this.getVisites();
	}

	async getVisites() {
		try {
			var res = await this.visiteService.getAll(this.filter).toPromise();
			this.visitesList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.visitesList.total,
				page: this.visitesList.current_page,
				last_page: this.visitesList.last_page
			};
			this.filter.page = this.pagination.page;
			this.filter.per_page = this.pagination.pageSize;
			this.cdr.detectChanges();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

	changePagination() {
		this.pagination = {
			...this.pagination,
			pageSize: this.pagination.pageSize,
			total: this.pagination.total
		};
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getVisites();
	}


	viewVisite(visiteId) {
		// this.router.navigateByUrl('visites-securite/detail/' + visiteId);
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
			timer: 1500
		})
	}
	editVisite(visiteId) {

		// this.router.navigateByUrl('visites-securite/edit/' + visiteId);
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
			timer: 1500
		})
	}
	deleteVisite(visiteId) {
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
			timer: 1500
		})
	}

	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
		console.log(this.filter)
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getVisites();
	}

	toggleOrderWay() {
		if (this.filter.order_way == 'asc') {
			this.filter.order_way = 'desc';
		} else {
			this.filter.order_way = 'asc';
		}
	}
	isOrderedBy(by) {
		if (Array.isArray(by)) {
			return JSON.stringify(by) == JSON.stringify(this.filter.order_by)
		} else {
			return by == this.filter.order_by
		}
	}
}

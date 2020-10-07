import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { VisiteOutillageService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { VisiteOutillage } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-visites-outillage-list',
	templateUrl: './visites-outillage-list.component.html',
	styleUrls: ['./visites-outillage-list.component.scss']
})
export class VisitesOutillageListComponent implements OnInit {

	public visitesList: Paginate < VisiteOutillage > ;
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
		order_by: ['date_visite', 'created_at'],
		order_way: 'desc',
		keyword: "",
		dateRange: [],
		status_id: "",
		params: []
	};
	displayedVisiteColumns = ['code','outillage', 'redacteur', 'visite', 'date_visite', 'ko_solved_count', 'ko_unsolved_count', 'action'];


	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected visiteService: VisiteOutillageService,
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
			if(!this.cdr['destroyed']){ 
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
			total: this.pagination.total
		};
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getVisites();
	}


	viewVisite(visiteId) {
		this.router.navigate(['../detail', visiteId], { relativeTo: this.activatedRoute });
	}
	editVisite(visiteId) {
		this.router.navigate(['../edit', visiteId], { relativeTo: this.activatedRoute });
	}
	async deleteVisite(visiteId) {
		this.visiteService.delete(visiteId).toPromise().then(res => {
			Swal.fire({
				title: this.translate.instant("VISITES.NOTIF.VISIT_DELETED.TITLE"),
				showConfirmButton: false,
				icon : 'success',
				timer: 1500
			});
			this.getVisites();
		}).catch(err => {
			Swal.fire({
				title: this.translate.instant("VISITES.NOTIF.VISIT_NOT_DELETED.TITLE"),
				showConfirmButton: false,
				icon : 'error',
				timer: 1500
			});
		});
	}

	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
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

	advancedSearchChanged($event){
		this.showFilters = $event;
	}

	udpateFilters(filters){
		for (let [key, value] of Object.entries(filters)) {
			this.filter[key] = value;
		}
		this.getVisites();
	}

	exportList(){
		var filters = {...this.filter};
		filters.type="EXCEL";
		for(const prop in filters){
			if(!filters[prop]){
				delete filters[prop];
			}
		}
		return this.visiteService.export(filters);
	}
}

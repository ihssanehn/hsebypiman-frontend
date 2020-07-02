import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { VisiteEpiService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { VisiteEpi } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-visites-epi-list',
	templateUrl: './visites-epi-list.component.html',
	styleUrls: ['./visites-epi-list.component.scss']
})
export class VisitesEpiListComponent implements OnInit {

	public visitesList: Paginate < VisiteEpi > ;
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
		order_by: ['visites_epi.date_visite', 'visites_epi.created_at'],
		order_way: 'desc',
		keyword: "",
		dateRange: [],
		status_id: "",
		params: []
	};
	displayedVisiteColumns = ['code','epi', 'epi_cat', 'redacteur', 'visite', 'date_visite', 'ko_solved_count', 'ko_unsolved_count', 'action'];


	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected visiteService: VisiteEpiService,
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
		// this.router.navigate(['../edit', visiteId], { relativeTo: this.activatedRoute });
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
			timer: 1500
		})
	}
	deleteVisite(visiteId) {
		this.visiteService.delete(visiteId).toPromise().then(res => {
			Swal.fire({
				icon: 'success',
				title: 'La visite a correctement été supprimé',
				showConfirmButton: false,
				timer: 1500
			});
		}).catch(err => {
			Swal.fire({
				icon: 'error',
				title: "La visite n'a pas pu être supprimée",
				showConfirmButton: false,
				timer: 1500
			});
		})
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
}

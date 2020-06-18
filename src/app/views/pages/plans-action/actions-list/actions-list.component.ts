import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { ActionService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Action } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-actions-list',
	templateUrl: './actions-list.component.html',
	styleUrls: ['./actions-list.component.scss']
})
export class ActionsListComponent implements OnInit, AfterViewInit, OnDestroy {

	public actionsList: Paginate < Action > ;
	selectedAction: Action;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: 'created_at',
		order_way: 'desc',
		keyword: "",
	};
	showFilters:Boolean = false;
	displayedActionColumns = [
		'created_at', 'type', 'risque', 'name', 
		'objectif', 'pilote', 'delai', 'status', 
		'realisation', 'efficacite', 'commentaires', 'action'
	];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected actionService: ActionService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.getActions();
	}


	ngOnDestroy(){
		this.cdr.detach();
	}

	async getActions() {
		try {
			var res = await this.actionService.getAll(this.filter).toPromise();
			this.actionsList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.actionsList.total,
				page: this.actionsList.current_page,
				last_page: this.actionsList.last_page
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
	exportList(){
		var filters = {...this.filter};
		filters.type="EXCEL";
		for(const prop in filters){
			if(!filters[prop]){
				delete filters[prop];
			}
		}
		return this.actionService.export(filters);
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
		this.getActions();
	}

	viewAction(actionId) {
		this.router.navigateByUrl('plans-action/detail/' + actionId);
	}
	editAction(actionId) {
		this.router.navigateByUrl('plans-action/edit/' + actionId);
	}
	deleteAction(actionId) {
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
			timer: 1500
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
		this.getActions();
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
		this.getActions();
	}
}

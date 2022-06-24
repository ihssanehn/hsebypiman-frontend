import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { RemonteeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Remontee } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-remontees-list',
	templateUrl: './remontees-list.component.html',
	styleUrls: ['./remontees-list.component.scss']
})
export class RemonteesListComponent implements OnInit, AfterViewInit {

	public remonteesList: Paginate < Remontee > ;
	remontee_id: number;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		paginate: true,
		order_by: ['created_at'],
		order_way: 'desc',
		keyword: "",
	};
	showFilters:Boolean = false;
	displayedRemonteColumns = [
		'creator','description','type','created_at','documents_count','status','action'
	];

	constructor(
		private router: Router,
		protected remonteeService: RemonteeService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.getRemontees();
	}

	async getRemontees() {
		try {
			var res = await this.remonteeService.getAll(this.filter).toPromise();
			this.remonteesList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.remonteesList.total,
				page: this.remonteesList.current_page,
				last_page: this.remonteesList.last_page
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
		return this.remonteeService.export(filters);
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
		this.getRemontees();
	}

	viewRemonte(remonteId) {
		this.router.navigateByUrl('remontees/detail/' + remonteId);
	}
	editRemonte(remonteId) {
		this.router.navigateByUrl('remontees/edit/' + remonteId);
	}
	deleteRemonte(remonteId) {
		Swal.fire({
				icon: 'warning',
				title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.TITLE"),
				text: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETE_CONFIRMATION.LABEL"),
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.DELETE"),
			}).then(async response => {
				if (response.value) {

					this.remonteeService.delete(remonteId).toPromise().then(res=>{
						this.getRemontees();
						Swal.fire({
							title: this.translate.instant("REMONTEES.NOTIF.REMONTEE_DELETED.TITLE"),
							showConfirmButton: false,
							icon: 'success',
							timer: 1500
						});
					})
					// this.saveForm(form);


				}
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
		this.getRemontees();
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
		this.getRemontees();
	}
}

import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CauserieService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Causerie } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-causeries-list',
	templateUrl: './causeries-list.component.html',
	styleUrls: ['./causeries-list.component.scss']
})
export class CauseriesListComponent implements OnInit, AfterViewInit {

	public causeriesList: Paginate < Causerie > ;
	causerie_id: number;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: ['libelle'],
		order_way: 'asc',
		keyword: "",
	};
	showFilters:Boolean = false;
	displayedCauserieColumns = [
		'libelle', 'date', 'organisateur', 'participants_count', 'action'
	];

	constructor(
		private router: Router,
		protected causerieService: CauserieService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.getCauseries();
	}

	async getCauseries() {
		try {
			var res = await this.causerieService.getAll(this.filter).toPromise();
			this.causeriesList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.causeriesList.total,
				page: this.causeriesList.current_page,
				last_page: this.causeriesList.last_page
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
		return this.causerieService.export(filters);
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
		this.getCauseries();
	}

	viewCauserie(causerieId) {
		this.router.navigateByUrl('causeries/detail/' + causerieId);
	}
	editCauserie(causerieId) {
		this.router.navigateByUrl('causeries/edit/' + causerieId);
	}
	deleteCauserie(causerieId) {
		var causerie = this.causeriesList.data.filter(x=>x.id == causerieId)[0];
		if(causerie.participants_count > 0){
			Swal.fire({
				title: this.translate.instant("CAUSERIES.NOTIF.CAUSERIE_NOT_DELETED.LABEL"),
				showConfirmButton: false,
				timer: 1500
			})
		}else{
			this.causerieService.delete(causerieId).toPromise().then(resp=>{
				Swal.fire({ icon: 'success', 
            title:this.translate.instant("CAUSERIES.NOTIF.CAUSERIE_DELETED.LABEL"), 
            showConfirmButton: false,
            timer: 1500 
          })
					this.getCauseries();
			})
		}
	}

	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getCauseries();
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
		this.getCauseries();
	}
}

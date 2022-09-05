import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Router } from '@angular/router';
import { PersonnelService, PeriodService } from '@app/core/services';
import Swal from 'sweetalert2';
import { Personnel } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-suivi-hse-list',
  templateUrl: './suivi-hse-list.component.html',
  styleUrls: ['./suivi-hse-list.component.scss']
})
export class SuiviHseListComponent implements OnInit, AfterViewInit, OnDestroy {

  	salariesList: Paginate<Personnel>;
	selectedSalarie: Personnel;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: 'prenom',
		order_way: 'asc',
		keyword: ""
	};
	showFilters:Boolean = false;
	displayedSalarieColumns =  [ 'prenom','nom', 'fonction', 'epi', 'formation', 'passeport_hse', 'remontees', 'causerie'];
	


  constructor(
    private router: Router,
		protected salarieService: PersonnelService,
		protected periodService: PeriodService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
		this.getSalaries();
	}

	ngOnDestroy(){
		this.cdr.detach();

  }

  async getSalaries() {
		try {
			var res = await this.salarieService.getAll(this.filter).toPromise();
			this.salariesList = res.result.data;

			this.pagination = {
				...this.pagination,
				total: this.salariesList.total,
				page: this.salariesList.current_page,
				last_page: this.salariesList.last_page
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
			total: this.pagination.total,
			last_page: this.pagination.last_page
		};
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getSalaries();
  }
  
  viewSalarie(actionId) {
		this.router.navigateByUrl('suivi-hse/detail/' + actionId);
  }
  
	deleteSalarie(actionId) {
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
			timer: 1500
		})
	}

	setOrder(by, isDynamicCol = false) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getSalaries();
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
		this.getSalaries();
	}

}

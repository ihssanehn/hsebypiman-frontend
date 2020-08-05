import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Router } from '@angular/router';
import { PersonnelService } from '@app/core/services';
import Swal from 'sweetalert2';
import { Personnel } from '@app/core/models';

@Component({
  selector: 'tf-salaries-list',
  templateUrl: './salaries-list.component.html',
  styleUrls: ['./salaries-list.component.scss']
})
export class SalariesListComponent implements OnInit, AfterViewInit, OnDestroy {

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
		order_by: 'created_at',
		order_way: 'desc',
		keyword: "",
		order_by_dynamic_col: false
	};
	showFilters:Boolean = false;
	displayedSalarieColumns = [];
	staticColumns = ['nom', 'prenom', 'fonction'];
	dynamicColumns: any[];
	


  constructor(
    private router: Router,
		protected salarieService: PersonnelService,
		protected cdr: ChangeDetectorRef,
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
			if(this.salariesList.data.length){
				this.dynamicColumns = this.salariesList.data[0].catMetricsList;
				this.displayedSalarieColumns = [];
				this.fetchColumns(this.dynamicColumns);
			}
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

  fetchColumns(dynamicColumns){
	  this.displayedSalarieColumns = [...this.staticColumns];
	  dynamicColumns.forEach(cat => {
		  this.displayedSalarieColumns.push(cat.code);
	  });
	  this.displayedSalarieColumns.push('action');
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
		this.router.navigateByUrl('salaries/detail/' + actionId);
  }
  
	deleteSalarie(actionId) {
		Swal.fire({
			title: 'Désolé cette fonctionnalité n\'a pas encore été implémentée',
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
			this.filter.order_by_dynamic_col = isDynamicCol;
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

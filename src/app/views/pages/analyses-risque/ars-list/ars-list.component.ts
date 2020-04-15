import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { ArService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tf-ars-list',
  templateUrl: './ars-list.component.html',
  styleUrls: ['./ars-list.component.scss']
})
export class ArsListComponent implements OnInit {

  public arsList : Paginate<Ar>;
  pagination: any = {
		page: 1,
		last_page: 1,
		total: 10,
		pageSize: 10,
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		orders_by: [],
		keyword: "",
		dateRange: [],
		status_id: "",
		params:[]
	};
	displayedArColumns=['number','name','charge_affaire','status','sign_count','created_at','action'];

  	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected arService:ArService,
		protected cdr:ChangeDetectorRef,
		private translate:TranslateService,
  	) {}

  	ngOnInit() {
    	this.getArs();
  	}
  
  	async getArs(){
    	try {
			this.arsList = await this.arService.search(this.filter).toPromise();
			this.pagination = { 
				...this.pagination, 
				total: this.arsList.total, 
				page: this.arsList.current_page, 
				last_page: this.arsList.last_page 
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
			total: this.pagination.total, 
			last_page: this.pagination.last_page 
		};
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getArs();
	}

	editAr(ar){
		this.router.navigate(['../edit', ar.id], { relativeTo: this.activatedRoute });
		console.log('éditer le Ar n°'+ar.id);
	}

}

import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { ChantierService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Chantier } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChantierTableDataSource } from './table-chantiers.data-source';

@Component({
  selector: 'tf-chantiers-list',
  templateUrl: './chantiers-list.component.html',
  styleUrls: ['./chantiers-list.component.scss']
})
export class ChantiersListComponent implements OnInit {

  public chantiersList : Paginate<Chantier>;
  pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10
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
	displayedChantierColumns=['number','client','name','status','charge_affaire','montant','ars_count','latest_ar','vss_count','latest_vs','action'];

  	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected chantierService:ChantierService,
		protected cdr:ChangeDetectorRef,
		private translate:TranslateService,
  	) {}

  	ngOnInit() {
    	this.getChantiers();
  	}
  
  	async getChantiers(){
    	try {
			this.chantiersList = await this.chantierService.search(this.filter).toPromise();
			this.pagination = { ...this.pagination, total: this.chantiersList.total, page: this.chantiersList.current_page };
			this.filter.page = this.pagination.page;
			this.filter.per_page = this.pagination.pageSize;
			this.cdr.detectChanges();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  	}

  	changePagination() {
		this.pagination = { ...this.pagination, pageSize: this.pagination.pageSize, total: this.pagination.total };
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getChantiers();
	}

	editChantier(chantier){
		this.router.navigate(['../edit', chantier.id], { relativeTo: this.activatedRoute });
		console.log('éditer le chantier n°'+chantier.id);
	}

}

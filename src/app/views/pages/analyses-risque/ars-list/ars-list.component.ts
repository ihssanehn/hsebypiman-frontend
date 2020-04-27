import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { ArService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
		order_by: ['created_at'],
		order_way: 'desc',
		keyword: "",
	};
	showFilters: boolean= false;
	displayedArColumns=['number','client','chantier','charge_affaire','created_at','status','date_demarrage_chantier','sign_count','observations','action'];

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
			var res = await this.arService.getAll(this.filter).toPromise();
			this.arsList = res.result.data;
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

	editAr(arId){
		this.router.navigate(['../edit', arId], { relativeTo: this.activatedRoute });
	}

	viewAr(arId){
		this.router.navigate(['../detail', arId], { relativeTo: this.activatedRoute });
	}

	duplicateAr(arId){
		this.router.navigate(['analyses-risque/add'], {queryParams:{ar_id:arId}})
	}

	async deleteAr(arId){
		await this.arService.delete(arId).toPromise();
		this.getArs();
		Swal.fire({
			icon: 'success',
			title: 'Analyse de risque a été supprimé avec succès',
			showConfirmButton: false,
			timer: 1500
		})
	}


	setOrder(by) {
		console.log(this.filter)
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getArs();
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
		console.log(this.filter);
		this.getArs();
	}

}

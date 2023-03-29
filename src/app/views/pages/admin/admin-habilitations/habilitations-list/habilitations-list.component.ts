import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Habilitation } from '@app/core/models';
import { HabilitationService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-habilitations-list',
  templateUrl: './habilitations-list.component.html',
  styleUrls: ['./habilitations-list.component.scss']
})
export class HabilitationsListComponent implements OnInit, AfterViewInit, OnDestroy {

  	habilitationsList: Paginate<Habilitation>;
	selectedHabilitation: Habilitation;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_way: 'desc',
		keyword: "",
	};
	showFilters: Boolean = false;
	displayedHabilitationColumns = ['libelle', 'categorie', 'duree_validite', 'action'];
  
	constructor(
		private router: Router,
		private habilitationService: HabilitationService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService
	) { }

	ngOnInit() {
	}

  	ngAfterViewInit(){
		this.getHabilitations();
	}

  	ngOnDestroy(){
		this.cdr.detach();
	}

  	async getHabilitations() {
		try {
			var res = await this.habilitationService.getAll(this.filter).toPromise();
			this.habilitationsList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.habilitationsList.total,
				page: this.habilitationsList.current_page,
				last_page: this.habilitationsList.last_page
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
		this.getHabilitations();
	}

  	viewHabilitation(id) {
		this.router.navigateByUrl('admin/habilitations/detail/' + id);
	}

	addHabilitation(){
		this.router.navigateByUrl('admin/habilitations/add')
	}

	editHabilitation(id) {
		this.router.navigateByUrl('admin/habilitations/edit/' + id);
	}

	deleteHabilitation(id) {
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
			timer: 1500
		})
	}

  	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getHabilitations();
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
		this.getHabilitations();
	}
}

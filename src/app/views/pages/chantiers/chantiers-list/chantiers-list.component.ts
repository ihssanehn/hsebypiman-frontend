import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ChantierService, ModuleService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Chantier } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-chantiers-list',
	templateUrl: './chantiers-list.component.html',
	styleUrls: ['./chantiers-list.component.scss']
})
export class ChantiersListComponent implements OnInit, AfterViewInit, OnDestroy {

	public chantiersList: Paginate < Chantier > ;
	selectedChantier: Chantier;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: ['created_at'],
		order_way: 'desc',
		keyword: "",
		paginate: true,
	};
	showFilters:Boolean = false;

	displayedChantierColumns = [
		'number', 'name', 'client', 'status', 'charge_affaire', 
		'responsable_chiffrage', 'montant', 'created_at', 'date_demarrage', 'action'
	];

	constructor(
		private router: Router,
		protected chantierService: ChantierService,
		protected cdr: ChangeDetectorRef,
		private moduleService:ModuleService,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
		this.setTableColumns();
	}

	ngAfterViewInit(){
		this.getChantiers();
	}

	setTableColumns(){
		if(this.isActiveModule(['ENTREPRISE'])){
			var length = this.displayedChantierColumns.length;
			var elements = ['ee_presence',]
			this.displayedChantierColumns.splice(length -1, 0, ...elements);
		}
		if(this.isActiveModule(['ANALYSE'])){
			var length = this.displayedChantierColumns.length;
			var elements = ['ars_count', 'latest_ar',]
			this.displayedChantierColumns.splice(length -1, 0, ...elements);
		}
		if(this.isActiveModule(['VISITE'])){
			var length = this.displayedChantierColumns.length;
			var elements = ['vss_count', 'latest_vs']
			this.displayedChantierColumns.splice(length -1, 0, ...elements);
		}
	
	}

	isActiveModule(codes){
		return this.moduleService.isActived(codes);
	}


	ngOnDestroy(){
		this.cdr.detach();
	}

	async getChantiers() {
		try {
			var res = await this.chantierService.getAll(this.filter).toPromise();
			this.chantiersList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.chantiersList.total,
				page: this.chantiersList.current_page,
				last_page: this.chantiersList.last_page
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
		return this.chantierService.export(filters);
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
		this.getChantiers();
	}

	viewChantier(chantierId) {
		this.router.navigateByUrl('chantiers/detail/' + chantierId);
	}
	editChantier(chantierId) {
		this.router.navigateByUrl('chantiers/edit/' + chantierId);
	}
	deleteChantier(chantierId) {
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
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
		this.getChantiers();
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
		this.getChantiers();
	}
}

import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MaterielService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Materiel } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import moment from 'moment';



@Component({
	selector: 'tf-materiels-list',
	templateUrl: './materiels-list.component.html',
	styleUrls: ['./materiels-list.component.scss']
})
export class MaterielsListComponent implements OnInit, AfterViewInit {

	public materielsList: Paginate < Materiel > ;
	materiel_id: number;
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
	displayedMaterielColumns = [
		"vs_retard", "libelle", "numero_serie", "main_categorie",  "actual_user", "quantite_disponible", "action"
	];
	selectedMateriel: Materiel = null;

	constructor(
		private router: Router,
		protected materielService: MaterielService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.getMateriels();
	}

	async getMateriels() {
		try {
			var res = await this.materielService.getAll(this.filter).toPromise();
			this.materielsList = res.result.data;
			console.log(this.materielsList);
			this.pagination = {
				...this.pagination,
				total: this.materielsList.total,
				page: this.materielsList.current_page,
				last_page: this.materielsList.last_page
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
		return this.materielService.export(filters);
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
		this.getMateriels();
	}

	viewMateriel(materielId) {
		this.router.navigateByUrl('materiel/detail/' + materielId);
	}
	editMateriel(materielId) {
		this.router.navigateByUrl('materiel/edit/' + materielId);
	}
	deleteMateriel(materielId) {
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
		this.getMateriels();
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
		this.getMateriels();
	}

	getNextVisiteTooltip(materiel){
		if(materiel.date_prochaine_revision){
			var _date = moment(materiel.date_prochaine_revision).format('DD/MM/YYYY');
			if(moment(materiel.date_prochaine_revision).isBefore(moment())){
				return this.translate.instant("MATERIELS.NOTIF.LATE_CONTROLE.TITLE")+' : '+_date;
			}else if(moment(materiel.date_prochaine_revision).isBefore(moment().add(7, 'days'))){
				return this.translate.instant("MATERIELS.NOTIF.UPCOMING_CONTROLE.TITLE")+' : '+_date;
			}else{
				return null
			}
		}else{
			return this.translate.instant("MATERIELS.NOTIF.NEVER_CONTROLED.TITLE")
		}
	}

	isRetardVisite(materiel){
		if(!materiel.has_controle){
			return null;
		}else if(!materiel.date_prochaine_revision || moment(materiel.date_prochaine_revision).isBefore(moment())){
			return "retard"
		}else if(moment(materiel.date_prochaine_revision).isBefore(moment().add(7, 'days'))){
			return "a_venir"
		}
	}
}

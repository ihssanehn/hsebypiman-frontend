import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { EntrepriseService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Entreprise } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
	selector: 'tf-entreprises-list',
	templateUrl: './entreprises-list.component.html',
	styleUrls: ['./entreprises-list.component.scss']
})
export class EntreprisesListComponent implements OnInit, AfterViewInit {

	public entreprisesList: Paginate < Entreprise > ;
	entreprise_id: number;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: ['raison_sociale'],
		order_way: 'asc',
		keyword: "",
	};
	showFilters:Boolean = false;
	displayedEntrepriseColumns = [
		'raison_sociale', 'type', 'chantiers_count', 'action'
	];

	constructor(
		private router: Router,
		protected entrepriseService: EntrepriseService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.getEntreprises();
	}

	async getEntreprises() {
		try {
			var res = await this.entrepriseService.getAll(this.filter).toPromise();
			this.entreprisesList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.entreprisesList.total,
				page: this.entreprisesList.current_page,
				last_page: this.entreprisesList.last_page
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
		return this.entrepriseService.export(filters);
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
		this.getEntreprises();
	}

	viewEntreprise(entrepriseId) {
		this.router.navigateByUrl('entreprises/detail/' + entrepriseId);
	}
	editEntreprise(entrepriseId) {
		this.router.navigateByUrl('entreprises/edit/' + entrepriseId);
	}
	deleteEntreprise(entrepriseId) {
		var entreprise = this.entreprisesList.data.filter(x=>x.id == entrepriseId)[0];
		if(entreprise.chantiers_count > 0){
			Swal.fire({
				title: this.translate.instant("EES.NOTIF.EE_NOT_DELETED.LABEL"),
				showConfirmButton: false,
				timer: 1500
			})
		}else{
			this.entrepriseService.delete(entrepriseId).toPromise().then(resp=>{
				Swal.fire({ icon: 'success', 
            title:this.translate.instant("EES.NOTIF.EE_DELETED.LABEL"), 
            showConfirmButton: false,
            timer: 1500 
          })
					this.getEntreprises();
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
		this.getEntreprises();
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
		this.getEntreprises();
	}
}

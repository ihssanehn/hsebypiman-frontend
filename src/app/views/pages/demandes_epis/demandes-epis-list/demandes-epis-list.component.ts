import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DemandeEpisService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { DemandeEpis } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateStatusModalComponent } from '@app/views/partials/layout';


@Component({
	selector: 'tf-demandes-epis-list',
	templateUrl: './demandes-epis-list.component.html',
	styleUrls: ['./demandes-epis-list.component.scss']
})
export class DemandesEpisListComponent implements OnInit, AfterViewInit {

	public demandesEpisList: Paginate < DemandeEpis > ;
	demandeEpis_id: number;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		paginate: true,
		order_by: ['created_at'],
		order_way: 'desc',
		keyword: "",
	};
	showFilters:Boolean = false;
	displayedDemandeEpisColumns = ['id', 'creator','created_at','updated_at','status', 'action'];

	constructor(
		private router: Router,
		protected demandeEpisService: DemandeEpisService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private modalService: NgbModal,
	) {

	}

	ngOnInit() {
		this.getDemandesEpis();
	}

	ngAfterViewInit(){
		// this.getDemandesEpis();
	}

	async getDemandesEpis() {
		try {
			var res = await this.demandeEpisService.getAll(this.filter).toPromise();
			this.demandesEpisList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.demandesEpisList.total,
				page: this.demandesEpisList.current_page,
				last_page: this.demandesEpisList.last_page
			};
			this.filter.page = this.pagination.page;
			this.filter.per_page = this.pagination.pageSize;
			console.log(this.demandesEpisList)
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
		return this.demandeEpisService.export(filters);
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
		this.getDemandesEpis();
	}

	viewDemandeEpis(demandeId) {
		this.router.navigateByUrl('materiel/demandes-epis/detail/' + demandeId);
	}
	createDemandeEpis(){
		this.router.navigateByUrl('materiel/demandes-epis/add');
	}
	editDemandeEpis(demandeId) {
		this.router.navigateByUrl('materiel/demandes-epis/edit/' + demandeId);
	}
	// deleteDemandeEpis(demandeId) {
	// 	Swal.fire({
	// 			icon: 'warning',
	// 			title: this.translate.instant("DEMANDES_EPIS.NOTIF.DEMANDE_CANCEL_CONFIRMATION.TITLE"),
	// 			text: this.translate.instant("DEMANDES_EPIS.NOTIF.DEMANDE_CANCEL_CONFIRMATION.LABEL"),
	// 			showConfirmButton: true,
	// 			showCancelButton: true,
	// 			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
	// 			confirmButtonText: this.translate.instant("ACTION.DELETE"),
	// 		}).then(async response => {
	// 			if (response.value) {

	// 				this.demandeEpisService.delete(demandeId).toPromise().then(res=>{
	// 					this.getDemandesEpis();
	// 					Swal.fire({
	// 						title: this.translate.instant("DEMANDES_EPIS.NOTIF.DEMANDE_CANCELED.TITLE"),
	// 						showConfirmButton: false,
	// 						icon: 'success',
	// 						timer: 1500
	// 					});
	// 				})
	// 				// this.saveForm(form);


	// 			}
	// 		})
	// }

	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getDemandesEpis();
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
		this.getDemandesEpis();
	}

	updateStatus(demandeEpis_id){
		const modalRef = this.modalService.open(UpdateStatusModalComponent);
		modalRef.result.then(res=>{
			this.demandeEpisService.update(demandeEpis_id, {status_id:res}).toPromise().then(res=>{
				Swal.fire({
          icon: 'success',
          title: this.translate.instant("DEMANDES_EPIS.NOTIF.UPDATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.getDemandesEpis();
        });
			}).catch(error=>{
				console.log(error);
			});
		})
	}
}

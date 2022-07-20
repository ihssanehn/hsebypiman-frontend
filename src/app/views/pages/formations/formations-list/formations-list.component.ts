import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from '@app/core/models';
import { FormationService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-formations-list',
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.scss']
})
export class FormationsListComponent implements OnInit, AfterViewInit, OnDestroy {

  	formationsList: Paginate<Formation>;
	selectedFormation: Formation;
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
	};
	showFilters: Boolean = false;
	displayedFormationColumns = ['libelle', 'organisme_formation', 'date_debut', 'date_fin', 'habilitation', 'date_renouvellement', 'action'];
  
  constructor(
    private router: Router,
		private formationService: FormationService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
		this.getFormations();
	}

  ngOnDestroy(){
		this.cdr.detach();
	}

  async getFormations() {
		try {
			var res = await this.formationService.getAll(this.filter).toPromise();
			this.formationsList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.formationsList.total,
				page: this.formationsList.current_page,
				last_page: this.formationsList.last_page
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
		this.getFormations();
	}

  viewFormation(formationId) {
		this.router.navigateByUrl('formations/detail/' + formationId);
	}

	editFormation(formationId) {
		this.router.navigateByUrl('formations/edit/' + formationId);
	}

	deleteFormation(formationId) {
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
		this.getFormations();
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
		this.getFormations();
	}
}

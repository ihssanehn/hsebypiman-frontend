import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FlashInfoService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';
import { AuthService } from '@app/core/auth';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tf-flashinfos-list',
  templateUrl: './flashinfos-list.component.html',
  styleUrls: ['./flashinfos-list.component.scss']
})
export class FlashInfosListComponent implements OnInit {


  flashinfosList;
  selectedFlashInfo;

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
		paginate: true
	};
	showFilters:Boolean = false;

	displayedFlashInfosColumns = ['title','created_at','is_visible','on_top','creator','action'];



  constructor(
    
    private authService:AuthService,
    private FlashInfoService:FlashInfoService,
    private cdr:ChangeDetectorRef,
	private router: Router,
	private translate: TranslateService

  ) { }

  ngOnInit() {
    this.getFlashInfos();
  }

  async getFlashInfos(){
    try {
      var res = await this.FlashInfoService.getAll(this.filter).toPromise();
			this.flashinfosList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.flashinfosList.total,
				page: this.flashinfosList.current_page,
				last_page: this.flashinfosList.last_page
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
		this.getFlashInfos();
	}

	viewFlashInfo(flashinfoId) {
		console.log(flashinfoId)
		this.router.navigateByUrl('admin/flash-infos/detail/' + flashinfoId);
	}
	editFlashInfo(flashinfoId) {
		this.router.navigateByUrl('admin/flash-infos/edit/' + flashinfoId);
	}
	
	addFlashInfo(){
		this.router.navigateByUrl('admin/flash-infos/add')
	}

	// exportList(){
	// 	var filters = {...this.filter};
	// 	filters.type="EXCEL";
	// 	for(const prop in filters){
	// 		if(!filters[prop]){
	// 			delete filters[prop];
	// 		}
	// 	}
	// 	return this.FlashInfoService.export(filters);
	// }

	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getFlashInfos();
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
		this.getFlashInfos();
	}

	deleteFlashInfo(flashId) {
		Swal.fire({
				icon: 'warning',
				title: this.translate.instant("FLASHINFOS.NOTIF.FLASHINFO_DELETE_CONFIRMATION.TITLE"),
				text: this.translate.instant("FLASHINFOS.NOTIF.FLASHINFO_DELETE_CONFIRMATION.LABEL"),
				showConfirmButton: true,
				showCancelButton: true,
				cancelButtonText: this.translate.instant("ACTION.CANCEL"),
				confirmButtonText: this.translate.instant("ACTION.DELETE"),
			}).then(async response => {
				if (response.value) {

					this.FlashInfoService.delete(flashId).toPromise().then(res=>{
						this.getFlashInfos();
						Swal.fire({
							title: this.translate.instant("FLASHINFOS.NOTIF.FLASHINFO_DELETED.TITLE"),
							showConfirmButton: false,
							icon: 'success',
							timer: 1500
						});
					})
					// this.saveForm(form);


				}
			})
	}
}

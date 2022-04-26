import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@app/core/services';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


  usersList;
  selectedUser;

  pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10,
		last_page: 1
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		order_by: 'prenom',
		order_way: 'asc',
		keyword: "",	
	};
	showFilters:Boolean = false;

	displayedUsersColumns = [
		'prenom', 'nom', 'email', 'fonction', 'role', 'acces'
	];



  constructor(
    private UserService:UserService,
    private cdr:ChangeDetectorRef,
	private router: Router,
	private translate: TranslateService

  ) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers(){
    try {
      var res = await this.UserService.getAll(this.filter).toPromise();
			this.usersList = res.result.data;
			this.pagination = {
				...this.pagination,
				total: this.usersList.total,
				page: this.usersList.current_page,
				last_page: this.usersList.last_page
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
		this.getUsers();
	}

	viewUser(userId) {
		this.router.navigateByUrl('admin/users/detail/' + userId);
	}
	editUser(userId) {
		this.router.navigateByUrl('admin/users/edit/' + userId);
	}
	deleteUser(userId) {
		Swal.fire({
			title: this.translate.instant("NOTIF.FEATURE_NOT_IMPLEMENTED.TITLE"),
			showConfirmButton: false,
			timer: 1500
		})
	}
	addUser(){
		this.router.navigateByUrl('admin/users/add')
	}

	// exportList(){
	// 	var filters = {...this.filter};
	// 	filters.type="EXCEL";
	// 	for(const prop in filters){
	// 		if(!filters[prop]){
	// 			delete filters[prop];
	// 		}
	// 	}
	// 	return this.UserService.export(filters);
	// }

	// Au click, défini order by et order way. Si le order_by est déjà actif, toggle du order_way. Sinon, order_way asc par défaut
	setOrder(by) {
		if (this.isOrderedBy(by)) {
			this.toggleOrderWay()
		} else {
			this.filter.order_by = by;
			this.filter.order_way = 'asc';
		}
		this.getUsers();
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
		this.getUsers();
	}

	onAccessCheckChange(userId: number, checked: boolean){
		console.log(userId, checked);

		var userData = {
			'id': userId,
			'is_blocked': !checked
		}

		this.UserService
			.updateAccess(userData)
			.toPromise()
			.then((res) => {
				var code = res.message.code as SweetAlertIcon;
				var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				Swal.fire({
					icon: code,
					title: this.translate.instant("USERS.NOTIF.USER_UPDATED.TITLE"),
					showConfirmButton: false,
					html: message,
					timer: code == 'success' ? 1500 : 3000
				});
				this.cdr.markForCheck();
			});
    	this.cdr.markForCheck();
	}

}

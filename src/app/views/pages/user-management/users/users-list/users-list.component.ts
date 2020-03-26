import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Models
import {
	User,
	Role,
	AuthService
} from '../../../../../core/auth';
import { SubheaderService } from '../../../../../core/_base/layout';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';

@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {

	// Selection
	selection = new SelectionModel<User>(true, []);
	allRoles: Role[] = [];
	isAllSelected : boolean = false;
	pagination: any = {
		page: 1,
		total: 10,
		pageSize: 10
	};
	filter: any = {
		per_page: this.pagination.pageSize,
		page: this.pagination.page,
		keyword : "",
		role_ids : [],
		orders_by: []
	};
	usersResult : Paginate<User>;

	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private authService : AuthService,
		private router: Router,
		// private notificationService : NzNotificationService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) {}

	/**
	 * On init
	 */
	ngOnInit() {
		// this.subheaderService.setTitle('User management');
		this.getUsers();
	}

	async getUsers(){
		// this.usersResult = await this.authService.getUsersPaginate(this.filter).toPromise();
		this.pagination = { ...this.pagination, total: this.usersResult.total, page: this.usersResult.current_page };
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.cdr.detectChanges();
	}

	changePagination(){
		this.pagination = { ...this.pagination, pageSize: this.pagination.pageSize, total: this.pagination.total };
		this.filter.page = this.pagination.page;
		this.filter.per_page = this.pagination.pageSize;
		this.getUsers();
	  }


	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	async deleteUser(_item: User) {

		const _deleteMessage = `User has been deleted`;
		this.authService.deleteUser(_item.id).toPromise();
		// this.notificationService.info("Success", _deleteMessage);
		this.getUsers();
	}


	toggleSelectAll(){
		this.usersResult.data.forEach((el: User) => {
			if(this.selection.isSelected(el)){
				this.selection.deselect(el)
			}else{
				this.selection.select(el);
			}
		});
	}

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editUser(id) {
		this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
	}
}

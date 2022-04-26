// Angular
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup  } from "@angular/forms";
// RxJS
import { Subscription } from "rxjs";
// Services and Models
import { User, Role } from "../../../../../core/auth";
@Component({
	selector: "tf-user-edit",
	templateUrl: "./user-edit.component.html",
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
	// Public properties
	user: User;
	userForm: FormGroup;
	allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
	) { }

	/**
	 * On init
	 */
	async ngOnInit() {
		// const routeSubscription = this.activatedRoute.params.subscribe(
		// 	async params => {
		// 		const id = params.id;
		// 		if (id) {
		// 			var res = await this.authService
		// 				.getUserById(id)
		// 				.toPromise();
						
		// 			this.user = res.result.data;
		// 			this.initUser();
		// 			this.createForm();

		// 			this.editMode = this.user.id ? true : false;
		// 			if(!this.editMode){
		// 				this.password.setValidators([Validators.required]);
		// 				this.confirmPassword.setValidators([Validators.required]);
		// 			}
		// 		} else {
		// 			this.user = new User();
		// 			this.user.clear();
		// 			this.initUser();
		// 			this.createForm();
		// 		}
		// 	}
		// );
		// this.permissionsService.hasPermission('ROOT').then(async hasPermission => {
		// 	if(hasPermission){
		// 		this.allRoles = await this.authService.getAllRoles().toPromise();
		// 	}
		// });
		// this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		// this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	initUser() {

		// if (!this.user.id) {
		// 	this.subheaderService.setTitle("Create user");
		// 	this.subheaderService.setBreadcrumbs([
		// 		// { title: "User Management", page: `user-management` },
		// 		// { title: "Users", page: `user-management/users` },
		// 		// { title: "Create user", page: `user-management/users/add` }
		// 	]);
		// 	return;
		// }
		// this.subheaderService.setTitle("Edit user");
		// this.subheaderService.setBreadcrumbs([
		// 	// { title: "User Management", page: `user-management` },
		// 	// { title: "Users", page: `user-management/users` },
		// 	// {
		// 	// 	title: "Edit user",
		// 	// 	page: `user-management/users/edit`,
		// 	// 	queryParams: { id: this.user.id }
		// 	// }
		// ]);
	}



	createForm() {
		// this.userForm = this.userFB.group({
		// 	username: [this.user.nom, Validators.required],
		// 	prenom: [this.user.prenom, Validators.required],
		// 	nom: [this.user.nom, Validators.required],
		// 	email: [this.user.email, Validators.email],
		// 	phone: [this.user.prenom, Validators.required],
		// 	role: [this.user.role, Validators.required],
		// 	password: [""],
		// 	confirmPassword : [""]
		// });
		// this.loaded = true;
		// this.cdr.detectChanges();
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		// const url = `/user-management/users`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshUser(isNew: boolean = false, id = 0) {
		// let url = this.router.url;
		// if (!isNew) {
		// 	this.router.navigate([url], { relativeTo: this.activatedRoute });
		// 	return;
		// }

		// url = `/user-management/users/edit/${id}`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}


	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSubmit(withBack: boolean = false) {
		// const controls = this.userForm.controls;
		// if (this.userForm.invalid) {
		// 	// this.notificationService.error("Error", "Some fields are required or incorrectly filled");
		// 	return;
		// }
		// const editedUser = this.prepareUser();
		// if (editedUser.id) {
		// 	this.updateUser(editedUser, withBack);
		// 	return;
		// }
		// this.addUser(editedUser, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	// prepareUser(): User {
		// const controls = this.userForm.controls;
		// const _user = new User();
		// //_user.clear();
		// _user.role = controls.role.value.id;
		// _user.nom = controls.nom.value;
		// _user.prenom = controls.prenom.value;
		// _user.id = this.user.id;
		// // _user.lastname = controls.lastname.value;
		// // _user.firstname = controls.firstname.value;
		// _user.email = controls.email.value;
		// if(!this.editMode){
		// 	_user.password = controls.password.value;
		// }
		// return _user;
	// }

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	async addUser(_user: User, withBack: boolean = false) {
		// const addSubscription = this.userService.createUser(_user).subscribe(newUser => {
		// 	const message = `New user successfully has been added.`;
		// 	// this.notificationService.success("Success", message);
		// 	this.goBackWithId();
		// },
		// (err) => {
		// 	for (let [key, value] of Object.entries(err.error.errors)){
		// 		// this.notificationService.error('Error', value[0]);
		// 	}
		// });
		// this.subscriptions.push(addSubscription);
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false) {
		// this.userService.updateUser(_user).toPromise();
		// const message = `User successfully has been saved.`;
		// // this.notificationService.success("Success", message);
		// if (withBack) {
		// 	this.goBackWithId();
		// } else {
		// 	this.refreshUser(false);
		// }
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = "Create user";
		if (!this.user || !this.user.id) {
			return result;
		}

		result = `Edit user - ${this.user.nom} ${this.user.prenom}`;
		return result;
	}


	get username() {
		return this.userForm.get("username");
	}

	get lastname() {
		return this.userForm.get("lastname");
	}

	get firstname() {
		return this.userForm.get('firstname');
	}

	get email() {
		return this.userForm.get("email");
	}

	get phone() {
		return this.userForm.get("phone");
	}

	get role() {
		return this.userForm.get("role");
	}

	get password() {
		return this.userForm.get('password')
	}

	get confirmPassword() {
		return this.userForm.get('confirmPassword') 
	}


}



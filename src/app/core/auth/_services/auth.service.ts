import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';



const API_USERS_URL = environment.apiBaseUrl + "users";
const API_PERMISSION_URL = environment.apiBaseUrl + "permissions";
const API_ROLES_URL = environment.apiBaseUrl + "roles";

@Injectable()
export class AuthService extends HttpService {
    constructor(
        private http: HttpClient,
		private permissionsService: NgxPermissionsService,
		private rolesService: NgxRolesService,
        private router: Router
    ) {
        super();
    }

    
	private currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
	public currentUser = this.currentUserSubject
		.asObservable()
		.pipe(distinctUntilChanged());

	public get currentUserValue(): User{
		return this.currentUserSubject.value;
	}
	// Authentication/Authorization
	login(email: string, password: string): Observable<JsonResponse<User>> {
		return this.http.post<JsonResponse<User>>(`${this.baseUrl}auth/login`, {email,password});
	}

	getUserByToken(){
		return this.http.get<JsonResponse<User>>(`${this.baseUrl}auth/user`)
		.pipe(
			map(res=> {
				localStorage.setItem('currentUser', JSON.stringify(res.result.data));
				this.currentUserSubject.next(res.result.data);
				return res;
			})
		);
	}

	updateProfile(payload): Observable<JsonResponse<User>> {
		return this.http
			.put<any>(`${this.baseUrl}auth/user`, payload)
			.pipe(map(result => result));
	}

	logout(): Observable<any> {
		return this.http.post(`${this.baseUrl}auth/logout`, {});
	}

	// register(user: User): Observable<any> {
	// 	const httpHeaders = new HttpHeaders();
	// 	httpHeaders.set("Content-Type", "application/json");
	// 	return this.http
	// 		.post<JsonResponse<User>>(API_USERS_URL, user, { headers: httpHeaders })
	// 		.pipe(
	// 			map((res: JsonResponse<User>) => {
	// 				return res;
	// 			}),
	// 			catchError(err => {
	// 				return null;
	// 			})
	// 		);
	// }

	/*
	 * Submit forgot password request
	 *
	 * @param {string} email
	 * @returns {Observable<any>}
	 */
	public requestPassword(email: string): Observable<any> {
		return this.http
			.post(this.baseUrl+ "auth/password-forgot", {"email":email});
	}


	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.post<QueryResultsModel>(
			API_USERS_URL + "/search",
			queryParams,
			{ headers: httpHeaders }
		);
	}
	// Permission
	getAllPermissions(): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL);
	}	// Roles
	getAllRoles(): Observable<Role[]> {
		return this.http.get<Role[]>(API_ROLES_URL);
	}

	getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
	}

	// CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.post<Role>(API_ROLES_URL, role, {
			headers: httpHeaders
		});
	}

	// UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<Role> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<Role>(url);
	}

	// Check Role Before deletion
	isRoleAssignedToUsers(roleId: number): Observable<boolean> {
		return this.http.get<boolean>(
			API_ROLES_URL + "/checkIsRollAssignedToUser?roleId=" + roleId
		);
	}

	findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.post<QueryResultsModel>(
			API_ROLES_URL + "/search",
			queryParams,
			{ headers: httpHeaders }
		);
	}

	loadUserPermissions(array){
		this.permissionsService.loadPermissions(array);
	}

	loadUserRole(role, permissions){
		this.rolesService.addRole(role,permissions);
	}

	registerPermissions(res: JsonResponse<User>) {
		var user = res.result.data;
		this.loadUserPermissions([user.role.code]);
	}


	registerNewToken(res: JsonResponse<User>){
		if(res.result.data.refresh_token){
			localStorage.setItem(environment.authTokenKey, res.result.data.refresh_token);
		}

	}

	async populate() {
		const userToken = localStorage.getItem(environment.authTokenKey);
		if (userToken) {
			let res = await this.getUserByToken().toPromise();
			this.registerPermissions(res);
			this.registerNewToken(res);
			return true;
		} else {
			localStorage.removeItem(environment.authTokenKey);
			this.router.navigate(['/auth/login']);
			return false;
		}
	}

	/*
	 * Handle Http operation that failed.
	 * Let the app continue.
	 *
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}
}

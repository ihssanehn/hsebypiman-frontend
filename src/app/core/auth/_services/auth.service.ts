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
import { NgxPermissionsService } from 'ngx-permissions';
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
        private router: Router
    ) {
        super();
    }

    
	private currentUserSubject = new BehaviorSubject<JsonResponse<User>>(null);
	public currentUser = this.currentUserSubject
		.asObservable()
		.pipe(distinctUntilChanged());

	// Authentication/Authorization
	login(email: string, password: string): Observable<JsonResponse<User>> {
		return this.http.post<JsonResponse<User>>(`${this.baseUrl}auth/login`, {
			email,
			password
		});
	}

	getUserByToken(): Observable<JsonResponse<User>> {
		return this.http.get<JsonResponse<User>>(`${this.baseUrl}auth/user`);
	}

	updateProfile(payload): Observable<JsonResponse<User>> {
		return this.http
			.put<any>(`${this.baseUrl}auth/user`, payload)
			.pipe(map(result => result));
	}

	logout(): Observable<any> {
		return this.http.post(`${this.baseUrl}auth/logout`, {});
	}

	register(user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http
			.post<JsonResponse<User>>(API_USERS_URL, user, { headers: httpHeaders })
			.pipe(
				map((res: JsonResponse<User>) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}

	/*
	 * Submit forgot password request
	 *
	 * @param {string} email
	 * @returns {Observable<any>}
	 */
	public requestPassword(email: string): Observable<any> {
		return this.http
			.get(API_USERS_URL + "/forgot?=" + email)
			.pipe(catchError(this.handleError("forgot-password", [])));
	}

	getList(): Observable<JsonResponse<User[]>> {
        return this.http.get<JsonResponse<User[]>>(API_USERS_URL+"/mini");
        // .pipe(
		// 	map((res: any) =>
		// 		// res.items.map((user: User) => new User().deserialize(user))
		// 	),
		// 	catchError(err => {
		// 		return null;
		// 	})
		// );
	}

	// getUsersPaginate(filter = {}): Observable<Paginate<User>> {
	// 	return this.http.post<Paginate<User>>(`${this.baseUrl}users/paginate`, { ...filter });
	// }

	getUserById(userId: number): Observable<JsonResponse<User>> {
		return this.http.get<JsonResponse<User>>(API_USERS_URL + `/${userId}`)
	}

	// DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete(url);
	}

	updateUser(_user: User): Observable<any> {
		return this.http.put<any>(`${this.baseUrl}users/` + _user.id, _user).pipe(map(result => result));
	}

	// CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<JsonResponse<User>> {
		return this.http.post<JsonResponse<User>>(`${this.baseUrl}users`, user);
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



	registerPermissions(user: JsonResponse<User>) {
		this.currentUserSubject.next(user);
		// this.permissionsService.loadPermissions([user.role.slug]);
	}



	async populate() {
		const userToken = localStorage.getItem(environment.authTokenKey);
		if (userToken) {
			let user = await this.getUserByToken().toPromise();
			this.registerPermissions(user);
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

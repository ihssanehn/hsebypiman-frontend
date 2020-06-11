import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { User } from '@app/core/auth/_models/user.model';
import { map } from 'rxjs/operators';


export class UserService extends HttpService{

  baseUrl = environment.apiBaseUrl+'users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getList(){
    return this.http.get<JsonResponse<User[]>>(this.baseUrl+"/mini");
  }

  getAll(params = {}){
		return this.http.post<JsonResponse<User[]>>(this.baseUrl, {...params});
  }

  getUserById(userId: number){
		return this.http.get<JsonResponse<User>>(this.baseUrl + `/${userId}`)
  }
  
	deleteUser(userId: number) {
		const url = `${this.baseUrl}/${userId}`;
		return this.http.delete(url);
	}

	updateUser(_user: User){
		return this.http.put<any>(`${this.baseUrl}users/` + _user.id, _user).pipe(map(result => result));
	}

	createUser(user: User){
		return this.http.post<JsonResponse<User>>(`${this.baseUrl}users`, user);
  }
  




}

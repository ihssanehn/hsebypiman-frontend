import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { User } from '@app/core/auth/_models/user.model';
import { map } from 'rxjs/operators';
import { Paginate } from '../_base/layout/models/paginate.model';


export class PersonnelService extends HttpService{

  baseUrl = environment.apiBaseUrl+'personnels';

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
		return this.http.post<JsonResponse<Paginate<User>>>(this.baseUrl, {...params});
  }

  getUserById(userId: number){
		return this.http.get<JsonResponse<User>>(this.baseUrl + `/${userId}`)
  }
  
}

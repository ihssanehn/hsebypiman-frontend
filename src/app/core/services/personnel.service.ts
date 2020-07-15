import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Paginate } from '../_base/layout/models/paginate.model';
import { Personnel } from '../models';


export class PersonnelService extends HttpService{

  baseUrl = environment.apiBaseUrl+'personnels';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getList(){
    return this.http.get<JsonResponse<Personnel[]>>(this.baseUrl+"/mini");
  }

  getAll(params = {}){
		return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
  }

  getUserById(personnelId: number){
		return this.http.get<JsonResponse<Personnel>>(this.baseUrl + `/${personnelId}`)
  }

  getPersonnelByYear(personnelId: number, year){
		return this.http.get<JsonResponse<Personnel>>(this.baseUrl + `/${personnelId}/year/${year}`)
  }

  setMetrics(personnelId, params){
    return this.http.post<JsonResponse<Personnel>>(this.baseUrl+'/'+personnelId+'/metric', params);
  }
  
}

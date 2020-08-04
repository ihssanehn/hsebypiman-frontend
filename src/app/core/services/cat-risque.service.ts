import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { CatRisque } from '@app/core/models/';
import { map } from 'rxjs/operators';


export class CatRisqueService extends HttpService{

  baseUrl = environment.apiBaseUrl+'cat-risques';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(params = {}){
    return this.http.post<JsonResponse<CatRisque[]>>(this.baseUrl, {...params = {}});
  }
  getAllAsAdmin(params = {}){
    var extendparams = {...params}
    extendparams['fromAdmin'] = true;
    return this.http.post<JsonResponse<CatRisque[]>>(this.baseUrl, {...extendparams});
  }
  get(item_id){
    return this.http.get<any>(this.baseUrl+'/'+item_id)
                    .pipe(map(result => result.result.data));
  }
  create(item){
      return this.http.post<any>(this.baseUrl+'/create', item)
                      .pipe(map(result => result.result.data));
  }
  update(item){
      return this.http.put<any>(this.baseUrl+'/'+item.id, item)
                      .pipe(map(result => result.result.data));
  }
  delete(item_id){
      return this.http.delete(this.baseUrl+'/'+item_id);
  }
  updateOrders(payload){
    return this.http.post<any>(`${this.baseUrl}/update-orders`, payload)
  }

}

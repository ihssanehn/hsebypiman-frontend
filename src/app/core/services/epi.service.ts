import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Epi } from '@app/core/models/';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class EpiService{

    baseUrl = environment.apiBaseUrl+'epis';
    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    getAll(params){
        return this.http.post<JsonResponse<Paginate<Epi>>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Epi[]>>(this.baseUrl+'/mini');
    }
    getListGrouped(){
        return this.http.get<JsonResponse<Epi[]>>(this.baseUrl+'/mini?grouped=true');
    }
    get(item_id){
        return this.http.get<JsonResponse<Epi>>(this.baseUrl+'/'+item_id);
    }
    create(item){
        return this.http.post<JsonResponse<Epi>>(this.baseUrl+'/'+'create', item);
    }
    update(item){
        return this.http.put<JsonResponse<Epi>>(this.baseUrl+'/'+item.id, item);
    }
    delete(item_id){
        return this.http.delete<JsonResponse<Epi>>(this.baseUrl+'/'+item_id);
    }
    

}
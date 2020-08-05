import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Type } from '@app/core/models/type.model';
import { Chantier } from '@app/core/models/chantier.model';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class TypeService extends HttpService{

    baseUrl = environment.apiBaseUrl+'types';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params = {}){
        return this.http.post<JsonResponse<Type[]>>(this.baseUrl, {...params});
    }
    getAllAsAdmin(params = {}){
        var extendparams = {...params}
        extendparams['fromAdmin'] = true;
        return this.http.post<JsonResponse<Type[]>>(this.baseUrl, {...extendparams});
    }
    getAllFromModel(model){
        return this.http.post<JsonResponse<Type[]>>(this.baseUrl, {'model': model});
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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Status } from '@app/core/models/';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class StatusService extends HttpService{

    baseUrl = environment.apiBaseUrl+'status';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params = {}){
        return this.http.post<JsonResponse<Status[]>>(this.baseUrl, {...params});
    }
    getAllAsAdmin(params = {}){
        var extendparams = {...params}
        extendparams['fromAdmin'] = true;
        return this.http.post<JsonResponse<Status[]>>(this.baseUrl, {...extendparams});
    }
    getAllFromModel(model){
        return this.http.post<JsonResponse<Status[]>>(this.baseUrl, {'model': model});
    }
    get(item_id){
        return this.http.get(this.baseUrl+'/'+item_id);
    }
    create(item){
        return this.http.post(this.baseUrl+'/'+'create', item);
    }
    update(item){
        return this.http.put(this.baseUrl+'/'+item.id, item);
    }
    delete(item_id){
        return this.http.delete(this.baseUrl+'/'+item_id);
    }
    

}
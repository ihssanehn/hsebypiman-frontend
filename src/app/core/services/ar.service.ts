import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ar } from '@app/core/models/ar.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model'
import { Router } from '@angular/router';

export class ArService extends HttpService{

    baseUrl = environment.apiBaseUrl+'ars';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<Ar>>>(this.baseUrl, {...params});
    }
    getList(): Observable<JsonResponse<Ar[]>> {
		return this.http.get<JsonResponse<Ar[]>>(this.baseUrl+'/mini');
	}
    get(chantier_id){
        return this.http.get<JsonResponse<Ar>>(this.baseUrl+'/'+chantier_id);
    }
    create(chantier){
        return this.http.post(this.baseUrl+'/'+'create', chantier);
    }
    update(chantier){
        return this.http.put(this.baseUrl+'/'+chantier.id, chantier);
    }
    delete(chantier_id){
        return this.http.delete(this.baseUrl+'/'+chantier_id);
    }
    
}
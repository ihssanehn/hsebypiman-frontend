import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Causerie } from '@app/core/models/';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class CauserieService{

    baseUrl = environment.apiBaseUrl+'causeries';
    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    getAll(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Causerie[]>>(this.baseUrl+'/mini');
    }
    getListGrouped(){
        return this.http.get<JsonResponse<Causerie[]>>(this.baseUrl+'/mini?grouped=true');
    }
    get(item_id){
        return this.http.get<JsonResponse<Causerie>>(this.baseUrl+'/'+item_id);
    }
    create(formData){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post<JsonResponse<Causerie>>(this.baseUrl+'/'+'create', formData, { headers: httpHeaders });
    }
    update(id: number, formData){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.put<JsonResponse<Causerie>>(this.baseUrl+'/'+id, formData, { headers: httpHeaders });
    }
    delete(item_id){
        return this.http.delete<JsonResponse<Causerie>>(this.baseUrl+'/'+item_id);
    }
    
    addParticipant(causerieId: number, params: any){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/'+causerieId+'/participants', params);
    }

    addFeedBackParticipant(causerieId: number, userId: number, params: any){
        return this.http.put<JsonResponse<any>>(this.baseUrl+'/'+causerieId+'/participants/'+userId, params);
    }
    
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }

    getStats(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/stats', params);
    }
    

}
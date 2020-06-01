import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import {Epi} from '@app/core/models/epi.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

@Injectable()
export class EpiService extends HttpService{

    baseUrl = environment.apiBaseUrl+'epis';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<Epi>>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Epi[]>>(this.baseUrl+'/mini');
    }
    get(epi_id): Observable<JsonResponse<Epi>>{
        return this.http.get<JsonResponse<Epi>>(this.baseUrl+'/'+epi_id);
    }
    create(epi){
        return this.http.post<JsonResponse<Epi>>(this.baseUrl+'/'+'create', epi);
    }
    update(epi){
        return this.http.put<JsonResponse<Epi>>(this.baseUrl+'/'+epi.id, epi);
    }
    delete(epi_id){
        return this.http.delete(this.baseUrl+'/'+epi_id);
    }
    closeEpi(epi_id){
        return this.http.get<JsonResponse<Epi>>(this.baseUrl+'/'+epi_id+'/close-epi');
    }
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        console.log(queryString);
        var url = this.baseUrl+'/export?'+queryString+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }
}
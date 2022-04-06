import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { VisiteEpi } from '@app/core/models/visite.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Router } from '@angular/router';

@Injectable()
export class VisiteEpiService extends HttpService{

    baseUrl = environment.apiBaseUrl+'visites-epi';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<VisiteEpi>>>(this.baseUrl, {...params});
    }
    getList(): Observable<JsonResponse<VisiteEpi[]>> {
		return this.http.get<JsonResponse<VisiteEpi[]>>(`${this.baseUrl+"/mini"}`);
	}
    get(visite_id): Observable<JsonResponse<VisiteEpi>>{
        return this.http.get<JsonResponse<VisiteEpi>>(this.baseUrl+'/'+visite_id);
    }
    create(visite){
        return this.http.post(this.baseUrl+'/'+'create', visite);
    }
    update(visite){
        return this.http.put(this.baseUrl+'/'+visite.id, visite);
    }
    delete(visite_id){
        return this.http.delete(this.baseUrl+'/'+visite_id);
    }
    
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        var url = this.baseUrl+'/export?'+queryString+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }
}
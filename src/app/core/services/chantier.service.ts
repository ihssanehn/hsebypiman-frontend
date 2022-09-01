import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import {Chantier} from '@app/core/models/chantier.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

@Injectable()
export class ChantierService extends HttpService{

    baseUrl = environment.apiBaseUrl+'chantiers';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Chantier[]>>(this.baseUrl+'/mini');
    }
    getAllClients(){
        return this.http.get<JsonResponse<any>>(this.baseUrl+'/clients');
    }
    get(chantier_id): Observable<JsonResponse<Chantier>>{
        return this.http.get<JsonResponse<Chantier>>(this.baseUrl+'/'+chantier_id);
    }
    create(chantier){
        return this.http.post<JsonResponse<Chantier>>(this.baseUrl+'/'+'create', chantier);
    }
    update(chantier){
        return this.http.put<JsonResponse<Chantier>>(this.baseUrl+'/'+chantier.id, chantier);
    }
    delete(chantier_id){
        return this.http.delete(this.baseUrl+'/'+chantier_id);
    }
    closeChantier(chantier_id){
        return this.http.get<JsonResponse<Chantier>>(this.baseUrl+'/'+chantier_id+'/close-chantier');
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
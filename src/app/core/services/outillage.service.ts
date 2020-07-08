import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Outillage } from '@app/core/models/outillage.model';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

@Injectable()
export class OutillageService extends HttpService{

    baseUrl = environment.apiBaseUrl+'outillages';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<Outillage>>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Outillage[]>>(this.baseUrl+'/mini');
    }
    get(materiel_id): Observable<JsonResponse<Outillage>>{
        return this.http.get<JsonResponse<Outillage>>(this.baseUrl+'/'+materiel_id);
    }
    create(epi){
        return this.http.post<JsonResponse<Outillage>>(this.baseUrl+'/'+'create', epi);
    }
    update(epi){
        return this.http.put<JsonResponse<Outillage>>(this.baseUrl+'/'+epi.id, epi);
    }
    delete(materiel_id){
        return this.http.delete(this.baseUrl+'/'+materiel_id);
    }
    closeOutillage(materiel_id){
        return this.http.get<JsonResponse<Outillage>>(this.baseUrl+'/'+materiel_id+'/close-epi');
    }
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        console.log(queryString);
        var url = this.baseUrl+'/export?'+queryString+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }

}
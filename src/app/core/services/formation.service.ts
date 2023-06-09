import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { Formation } from '../models';

@Injectable()
export class FormationService extends HttpService{

    baseUrl = environment.apiBaseUrl+'formations';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        params = {...params, paginate: true}
        return this.http.post<JsonResponse<Paginate<Formation>>>(this.baseUrl, {...params});
    }
    getAllList(params){
        params = {...params, paginate: false}
        return this.http.post<JsonResponse<Formation[]>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Formation[]>>(this.baseUrl+'/mini');
    }
    get(id): Observable<JsonResponse<Formation>>{
        return this.http.get<JsonResponse<Formation>>(this.baseUrl+'/'+id);
    }
    create(formation){
        return this.http.post<JsonResponse<Formation>>(this.baseUrl+'/'+'create', formation);
    }
    update(formation){
        return this.http.put<JsonResponse<Formation>>(this.baseUrl+'/'+formation.id, formation);
    }
    delete(id){
        return this.http.delete(this.baseUrl+'/'+id);
    }
    assignUsers(formation_id, params){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post<JsonResponse<Formation>>(this.baseUrl+'/'+formation_id+'/users/create', params, { headers: httpHeaders });
    }

}
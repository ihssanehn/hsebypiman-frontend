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
        return this.http.post<JsonResponse<Paginate<Chantier>>>(this.baseUrl, {...params});
    }
    getList(keyword = null){
        if(keyword){
            return this.http.get<JsonResponse<Chantier[]>>(this.baseUrl+'/mini');
        }else{
            return this.http.get<JsonResponse<Chantier[]>>(this.baseUrl+'/mini?keyword='+keyword);
        }
	}
    get(chantier_id): Observable<JsonResponse<Chantier>>{
        return this.http.get<JsonResponse<Chantier>>(this.baseUrl+'/'+chantier_id);
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
    closeChantier(chantier_id){
        return this.http.get<Chantier>(this.baseUrl+'/'+chantier_id+'/close-chantier');
    }
    

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { VisiteVehicule, Document } from '@app/core/models';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Router } from '@angular/router';

@Injectable()
export class VisiteVehiculeService extends HttpService{

    baseUrl = environment.apiBaseUrl+'visites-vehicule';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<VisiteVehicule>>>(this.baseUrl, {...params});
    }
    getList(): Observable<JsonResponse<VisiteVehicule[]>> {
		return this.http.get<JsonResponse<VisiteVehicule[]>>(`${this.baseUrl+"/mini"}`);
	}
    get(visite_id): Observable<JsonResponse<VisiteVehicule>>{
        return this.http.get<JsonResponse<VisiteVehicule>>(this.baseUrl+'/'+visite_id);
    }
    getPhotos(visite_id): Observable<JsonResponse<Document[]>>{
        return this.http.get<JsonResponse<Document[]>>(this.baseUrl+'/'+visite_id+'/photos');
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

    attachPhotos(visite_id, datas){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post(this.baseUrl+'/'+visite_id+'/photos/add', datas, { headers: httpHeaders });
    }

    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Materiel } from '@app/core/models/materiel.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

@Injectable()
export class MaterielService extends HttpService{

    baseUrl = environment.apiBaseUrl+'materiels';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        params = {...params, paginate: true}
        return this.http.post<JsonResponse<Paginate<Materiel>>>(this.baseUrl, {...params});
    }
    getAllList(params){
        params = {...params, paginate: false}
        return this.http.post<JsonResponse<Materiel[]>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Materiel[]>>(this.baseUrl+'/mini');
    }
    get(materiel_id): Observable<JsonResponse<Materiel>>{
        return this.http.get<JsonResponse<Materiel>>(this.baseUrl+'/'+materiel_id);
    }
    create(materiel){
        return this.http.post<JsonResponse<Materiel>>(this.baseUrl+'/'+'create', materiel);
    }
    update(materiel){
        return this.http.put<JsonResponse<Materiel>>(this.baseUrl+'/'+materiel.id, materiel);
    }
    delete(materiel_id){
        return this.http.delete(this.baseUrl+'/'+materiel_id);
    }
    closeMateriel(materiel_id){
        return this.http.get<JsonResponse<Materiel>>(this.baseUrl+'/'+materiel_id+'/close-materiel');
    }
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }

    createPret(materiel_id, params){
        return this.http.post<JsonResponse<Materiel>>(this.baseUrl+'/'+materiel_id+'/pret/create', params);
    }
    updatePret(materiel_id, params){
        return this.http.put<JsonResponse<Materiel>>(this.baseUrl+'/'+materiel_id+'/pret/update', params);
    }
    deletePret(pret_id){
        return this.http.delete<JsonResponse<Materiel>>(this.baseUrl+'/pret/'+pret_id+'/delete');
    }
    getStats(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/stats', params);
    }
    addDocuments(materiel_id, params){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post(this.baseUrl+'/'+materiel_id+'/add-documents', params, { headers: httpHeaders });
    }

}
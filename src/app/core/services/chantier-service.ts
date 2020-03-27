import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import {ChantierModel} from '@app/core/models/chantier.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model'
import { Router } from '@angular/router';

export class ChantierService extends HttpService{

    baseUrl = environment.apiBaseUrl+'chantiers/';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(){
        return this.http.get<Paginate<ChantierModel>>(this.baseUrl);
    }
    getAllItems(): Observable<ChantierModel[]> {
		return this.http.get<ChantierModel[]>(`${this.baseUrl}costings`);
	}
    get(chantier_id){
        return this.http.get(this.baseUrl+chantier_id);
    }
    search(params){
        return this.http.post<Paginate<ChantierModel>>(this.baseUrl+'search', {...params});
    }
    create(chantier){
        return this.http.post(this.baseUrl+'create', chantier);
    }
    update(chantier_id, chantier){
        return this.http.put(this.baseUrl+chantier_id, chantier);
    }
    delete(chantier_id){
        return this.http.delete(this.baseUrl+chantier_id);
    }
    

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Document } from '@app/core/models/document.model';
import { Chantier } from '@app/core/models/chantier.model';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class DashboardService extends HttpService{

    baseUrl = environment.apiBaseUrl+'dashboards';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAllStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl, {...params});
    }

    getChantierStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/chantiers', {...params});
    }

    getArStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/analyses-risque', {...params});
    }

    getVsStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/visites', {...params});
    }

    getActionStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/actions', {...params});
    }
    
    getEntrepriseStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/entreprises', {...params});
    }
    
}
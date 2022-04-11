import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Type } from '@app/core/models/type.model';
import { Chantier } from '@app/core/models/chantier.model';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class EntityService extends HttpService{

    baseUrl = environment.apiBaseUrl+'entities';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getList(){
        return this.http.get<JsonResponse<Type[]>>(this.baseUrl+"/mini");
    }

}
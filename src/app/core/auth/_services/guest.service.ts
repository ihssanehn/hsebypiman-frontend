import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map, distinctUntilChanged, timeout } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';



const API_USERS_URL = environment.apiBaseUrl + "guest";

@Injectable()
export class GuestService extends HttpService {
    constructor( 
      private http: HttpClient,
      private permissionsService: NgxPermissionsService,
      private rolesService: NgxRolesService,
      private router: Router
  ) {
      super();
  }


  find(params){
    return this.http.post<any>(`${API_USERS_URL}/find`, params);
  }
  
  updateItem(params){
    return this.http.post<any>(`${API_USERS_URL}/update-item`, params);
  }
}
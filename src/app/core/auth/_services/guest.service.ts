import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
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

  sendGuestAccess(params){
    return this.http.post<any>(`${API_USERS_URL}/send-access`, params)
  }
}
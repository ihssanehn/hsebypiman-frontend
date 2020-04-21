import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { CatHabilitation } from '@app/core/models/';


export class CatHabilitationService extends HttpService{

  baseUrl = environment.apiBaseUrl+'cat-habilitations';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(){
    return this.http.post<JsonResponse<CatHabilitation[]>>(this.baseUrl, {});
  }

}

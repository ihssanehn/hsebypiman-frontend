import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EpiType } from '../models/epiType.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';


export class EpiTypesService extends HttpService{

  baseUrl = environment.apiBaseUrl+'epi-types';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(){
    return this.http.post<JsonResponse<EpiType[]>>(this.baseUrl, {});
  }
}

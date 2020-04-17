import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { CatRisque } from '@app/core/models/';


export class CatRisqueService extends HttpService{

  baseUrl = environment.apiBaseUrl+'cat-risques';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(){
    return this.http.post<JsonResponse<CatRisque[]>>(this.baseUrl, {});
  }

}

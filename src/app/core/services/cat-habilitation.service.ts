import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { CatHabilitation } from '@app/core/models/';
import { map } from 'rxjs/operators';


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

  get(id){
    return this.http.get<any>(`${this.baseUrl}/${id}`)
                    .pipe(map(result => result.result.data));
  }

  create(payload){
    return this.http.post<any>(`${this.baseUrl}/create`, payload)
                    .pipe(map(result => result.result.data));
  }

  update(id, payload){
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload)
                    .pipe(map(result => result.result.data));
  }

  delete(id){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }


}

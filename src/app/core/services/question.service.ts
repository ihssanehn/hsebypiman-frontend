import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { Question } from '@app/core/models/';
import { map } from 'rxjs/operators';


export class QuestionService extends HttpService{

  baseUrl = environment.apiBaseUrl+'questions';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(params = {}){
    return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
  }
  getAllAsAdmin(params = {}){
    var extendparams = {...params}
    extendparams['fromAdmin'] = true;
    return this.http.post<JsonResponse<any>>(this.baseUrl, {...extendparams});
  }

  create(payload){
    return this.http.post<any>(`${this.baseUrl}/create`, payload);
  }

  update(payload){
    return this.http.put<any>(`${this.baseUrl}/${payload.id}`, payload)
                    .pipe(map(result => result.result.data));
  }

  delete(id){
    return this.http.delete<any>(`${this.baseUrl}/${id}`)
                    .pipe(map(result => result.result.data));
  }


}


import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { Habilitation } from '@app/core/models/';
import { map } from 'rxjs/operators';
import { Paginate } from '../_base/layout/models/paginate.model';
import { Observable } from 'rxjs';


export class HabilitationService extends HttpService{

  baseUrl = environment.apiBaseUrl+'habilitations';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(params = {}){
    params = {...params, paginate: true}
    return this.http.post<JsonResponse<Paginate<Habilitation>>>(this.baseUrl, {...params});
  }

  getAllList(params = {}){
    params = {...params, paginate: false}
    return this.http.post<JsonResponse<Habilitation[]>>(`${this.baseUrl}/list`, {...params});
  }

  get(id): Observable<JsonResponse<Habilitation>>{
    return this.http.get<JsonResponse<Habilitation>>(this.baseUrl+'/'+id);
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

  updateOrders(payload){
    return this.http.post<any>(`${this.baseUrl}/update-orders`, payload)
  }


}

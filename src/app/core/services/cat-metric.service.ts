
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient } from '@angular/common/http'
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { CatQuestion } from '@app/core/models/';
import { map } from 'rxjs/operators';


export class CatMetricService extends HttpService{

  baseUrl = environment.apiBaseUrl+'cat-metrics';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(params = {}){
    return this.http.post<JsonResponse<CatQuestion[]>>(this.baseUrl, {...params});
  }
  getAllAsAdmin(params = {}){
    var extendparams = {...params}
    extendparams['fromAdmin'] = true;
    return this.http.post<JsonResponse<CatQuestion[]>>(this.baseUrl, {...extendparams});
  }

  get(id){
    return this.http.get<any>(`${this.baseUrl}/${id}`)
                    .pipe(map(result => result.result.data));
  }

  create(payload){
    return this.http.post<any>(`${this.baseUrl}/create`, payload)
                    .pipe(map(result => result.result.data));
  }

  update(payload){
    return this.http.put<any>(`${this.baseUrl}/${payload.id}`, payload)
                    .pipe(map(result => result.result.data));
  }

  delete(id){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  updateOrders(payload){
    return this.http.post<any>(`${this.baseUrl}/update-orders`, payload)
  }


}

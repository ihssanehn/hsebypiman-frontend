
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Paginate } from '../_base/layout/models/paginate.model';
import { Observable } from 'rxjs';


export class PeriodService extends HttpService{

  baseUrl = environment.apiBaseUrl+'follow-up-periods';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(params = {}){
    return this.http.post<JsonResponse<Paginate<any>>>(this.baseUrl, {...params});
  }

  getList(){
    return this.http.get<JsonResponse<any[]>>(this.baseUrl+'/mini');
  }

  get(id): Observable<JsonResponse<any>>{
    return this.http.get<JsonResponse<any>>(this.baseUrl+'/'+id);
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

  getLatest(){
    return this.http.get<JsonResponse<any>>(this.baseUrl+'/latest');
  }
  
  getActual(){
    return this.http.get<JsonResponse<any>>(this.baseUrl+'/actual');
  }

}

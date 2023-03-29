
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { FlashInfo } from '@app/core/models/';
import { map } from 'rxjs/operators';

export class FlashInfoService extends HttpService{

  baseUrl = environment.apiBaseUrl+'flash-infos';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  get(flashinfo_id){
    return this.http.get<JsonResponse<FlashInfo>>(this.baseUrl+'/'+flashinfo_id);
  }

  getList(params = {}){
    return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
  }

  getAll(){
    return this.http.get<JsonResponse<any>>(this.baseUrl);
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

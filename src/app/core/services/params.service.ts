
import { HttpService } from './http-service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JsonResponse } from '../_base/layout/models/jsonResponse.model';
import { Param } from '../models/param.model';

export class ParamsService extends HttpService{

  baseUrl = environment.apiBaseUrl+'parameters';
  
  constructor(
      private http: HttpClient,
      private router: Router
  ) {
      super()
  }

  getAll(params = {}){
    return this.http.post<JsonResponse<Param[]>>(this.baseUrl, {...params});
  }
  getAllAsAdmin(params = {}){
    var extendparams = {...params}
    extendparams['fromAdmin'] = true;
    return this.http.post<JsonResponse<Param[]>>(this.baseUrl, {...extendparams});
  }
  getValues() {
    return this.http.get<JsonResponse<Param[]>>(this.baseUrl+'/mini');
  }
  
  getAllFromModel(model){
      return this.http.post<JsonResponse<Param[]>>(this.baseUrl, {'model': model});
  }

  get(item_id){
      return this.http.get(this.baseUrl+'/'+item_id);
  }

  create(item){
      return this.http.post(this.baseUrl+'/create', item);
  }

  update(item){
      return this.http.put(this.baseUrl+'/'+item.id, item);
  }

  delete(item_id){
      return this.http.delete(this.baseUrl+'/'+item_id);
  }
}

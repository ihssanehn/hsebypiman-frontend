import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/services/http-service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JsonResponse } from '../_base/layout/models/jsonResponse.model';
import { Paginate } from '../_base/layout/models/paginate.model';
import { Signature } from '@app/core/models/';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureService extends HttpService{

  baseUrl = environment.apiBaseUrl+'signatures';

  constructor(
      private http: HttpClient,
      private router: Router
  ) {
      super()
  }

  getAll(params){
    return this.http.post<JsonResponse<Paginate<Signature>>>(this.baseUrl, {...params});
  }
  getList(): Observable<JsonResponse<Signature[]>> {
  return this.http.get<JsonResponse<Signature[]>>(this.baseUrl+'/mini');
  }
  get(id){
      return this.http.get<JsonResponse<Signature>>(this.baseUrl+'/'+id);
  }
  create(signature){
      return this.http.post(this.baseUrl+'/'+'create', signature);
  }
  update(signature){
      return this.http.put(this.baseUrl+'/'+signature.id, signature);
  }
  delete(id){
      return this.http.delete(this.baseUrl+'/'+id);
  }

}

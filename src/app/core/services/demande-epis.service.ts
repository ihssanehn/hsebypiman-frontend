
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


export class DemandeEpisService extends HttpService{

  baseUrl = environment.apiBaseUrl+'demandes-epis';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getAll(params = {}){
    return this.http.post<JsonResponse<any>>(this.baseUrl, params);
  }
  get(item_id){
    return this.http.get<any>(this.baseUrl+'/'+item_id)
                    .pipe(map(result => result.result.data));
  }
  create(item){
      return this.http.post<any>(this.baseUrl+'/create', item)
                      .pipe(map(result => result.result.data));
  }
  update(id, item){
      return this.http.put<any>(this.baseUrl+'/'+id, item)
                      .pipe(map(result => result.result.data));
  }
  delete(item_id){
      return this.http.delete(this.baseUrl+'/'+item_id);
  }
  export(filters){
    var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
    var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
    window.open(url, '_blank');
  }
  addComment(id, comment){
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
    return this.http.post<JsonResponse<any>>(this.baseUrl+'/'+id+'/comment', comment, { headers: httpHeaders });
  }

}

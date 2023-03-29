import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Router } from '@angular/router';

@Injectable()
export class VisiteService extends HttpService{

    baseUrl = environment.apiBaseUrl+'visites';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    // getAll(params){
    //     return this.http.post<JsonResponse<Paginate<Visite>>>(this.baseUrl, {...params});
    // }
    // getList(): Observable<JsonResponse<Visite[]>> {
	// 	return this.http.get<JsonResponse<Visite[]>>(`${this.baseUrl+"/mini"}`);
	// }
    // get(visite_id): Observable<JsonResponse<Visite>>{
    //     return this.http.get<JsonResponse<Visite>>(this.baseUrl+'/'+visite_id);
    // }
    // create(visite){
    //     return this.http.post(this.baseUrl+'/'+'create', visite);
    // }
    // update(visite){
    //     return this.http.put(this.baseUrl+'/'+visite.id, visite);
    // }
    // delete(visite_id){
    //     return this.http.delete(this.baseUrl+'/'+visite_id);
    // }
    
    // export(filters){
    //     var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
    //     var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
    //     window.open(url, '_blank');
    // }
    
    getStats(params){
        return this.http.post<any>(this.baseUrl+'/stats', {...params});
    }
}
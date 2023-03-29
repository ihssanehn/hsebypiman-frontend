
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Entreprise } from '@app/core/models/';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class EntrepriseService{

    baseUrl = environment.apiBaseUrl+'entreprises';
    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    getAll(params){
        return this.http.post<JsonResponse<Paginate<Entreprise>>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Entreprise[]>>(this.baseUrl+'/mini');
    }
    getListGrouped(){
        return this.http.get<JsonResponse<Entreprise[]>>(this.baseUrl+'/mini?grouped=true');
    }
    get(item_id){
        return this.http.get<JsonResponse<Entreprise>>(this.baseUrl+'/'+item_id);
    }
    create(item){
        return this.http.post<JsonResponse<Entreprise>>(this.baseUrl+'/'+'create', item);
    }
    update(item){
        return this.http.put<JsonResponse<Entreprise>>(this.baseUrl+'/'+item.id, item);
    }
    delete(item_id){
        return this.http.delete<JsonResponse<Entreprise>>(this.baseUrl+'/'+item_id);
    }
    
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }


    getStats(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/stats', params);
    }
    

}
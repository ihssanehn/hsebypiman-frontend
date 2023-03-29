
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Type } from '@app/core/models/type.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class TypeService extends HttpService{

    baseUrl = environment.apiBaseUrl+'types';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params = {}){
        return this.http.post<JsonResponse<Type[]>>(this.baseUrl, {...params});
    }
    getAllAsAdmin(params = {}){
        var extendparams = {...params}
        extendparams['fromAdmin'] = true;
        return this.http.post<JsonResponse<Type[]>>(this.baseUrl, {...extendparams});
    }
    getAllFromModel(model){
        return this.http.post<JsonResponse<Type[]>>(this.baseUrl, {'model': model});
    }
    get(item_id){
        return this.http.get<any>(this.baseUrl+'/'+item_id)
                        .pipe(map(result => result.result.data));
    }
    create(item){
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post<any>(this.baseUrl+'/create', item, { headers: httpHeaders })
                        .pipe(map(result => result.result.data));
    }
    update(item){
        return this.http.put<any>(this.baseUrl+'/'+item.id, item)
                        .pipe(map(result => result.result.data));
    }
    delete(item_id){
        return this.http.delete(this.baseUrl+'/'+item_id);
    }
    
    updateOrders(payload){
        return this.http.post<any>(`${this.baseUrl}/update-orders`, payload)
    }
    
}
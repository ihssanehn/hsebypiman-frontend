
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Type } from '@app/core/models/type.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class FonctionService extends HttpService{

    baseUrl = environment.apiBaseUrl+'fonctions';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getList(){
        return this.http.get<JsonResponse<Type[]>>(this.baseUrl+"/mini");
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
        return this.http.post<any>(this.baseUrl+'/create', item)
                        .pipe(map(result => result.result.data));
    }
    update(item){
        return this.http.put<any>(this.baseUrl+'/'+item.id, item)
                        .pipe(map(result => result.result.data));
    }
    delete(item_id){
        return this.http.delete(this.baseUrl+'/'+item_id);
    }
    

}
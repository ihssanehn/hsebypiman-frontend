
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Document } from '@app/core/models/document.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class DocumentService extends HttpService{

    baseUrl = environment.apiBaseUrl+'documents';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params = {}){
        return this.http.post<JsonResponse<Document[]>>(this.baseUrl, {...params});
    }
    getAllAsAdmin(params = {}){
        var extendparams = {...params}
        extendparams['fromAdmin'] = true;
        return this.http.post<JsonResponse<Document[]>>(this.baseUrl, {...extendparams});
    }
    getAllFromModel(model){
        return this.http.post<JsonResponse<Document[]>>(this.baseUrl, {'model': model});
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
    readFile(item_id){
        return this.baseUrl+'/'+item_id+'/file'+'?entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey)
    }
    
    downloadFile(item_id){
        var url = this.baseUrl+'/'+item_id+'/download?entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }

    getFileByPath(path){
        return this.baseUrl+'/file?path='+path+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey)
    }
    

}
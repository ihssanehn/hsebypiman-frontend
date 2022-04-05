import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Action } from '@app/core/models';
import { Paginate } from '@app/core/_base/layout/models/paginate.model'
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model'
import { Router } from '@angular/router';

export class ActionService extends HttpService{

    baseUrl = environment.apiBaseUrl+'actions';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<Action>>>(this.baseUrl, {...params});
    }
    getList(): Observable<JsonResponse<Action[]>> {
		return this.http.get<JsonResponse<Action[]>>(this.baseUrl+'/mini');
	}
    get(action_id){
        return this.http.get<JsonResponse<Action>>(this.baseUrl+'/'+action_id);
    }
    create(action){
        return this.http.post<JsonResponse<Action>>(this.baseUrl+'/'+'create', action);
    }
    update(action){
        return this.http.put<JsonResponse<Action>>(this.baseUrl+'/'+action.id, action);
    }
    delete(action_id){
        return this.http.delete(this.baseUrl+'/'+action_id);
    }
    export(filters){
        var queryString = Object.keys(filters)
            .filter(key => filters[key])
            .map(key => key + '=' + filters[key])
            .join('&');
        var url = this.baseUrl+'/export?'+queryString+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }
    getStats(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/stats', params);
    }
    closeAction(action_id){
        return this.http.get<JsonResponse<Action>>(this.baseUrl+'/'+action_id+'/close-action');
    }
    abandonAction(action_id){
        return this.http.get<JsonResponse<Action>>(this.baseUrl+'/'+action_id+'/abandon-action');
    }
    attributeAction(action_id, pilote_id){
        return this.http.post<JsonResponse<Action>>(this.baseUrl+'/'+action_id+'/pilote/'+pilote_id, null);
    }
    
}
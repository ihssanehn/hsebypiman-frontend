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
    get(chantier_id){
        return this.http.get<JsonResponse<Action>>(this.baseUrl+'/'+chantier_id);
    }
    create(chantier){
        return this.http.post<JsonResponse<Action>>(this.baseUrl+'/'+'create', chantier);
    }
    update(chantier){
        return this.http.put<JsonResponse<Action>>(this.baseUrl+'/'+chantier.id, chantier);
    }
    delete(chantier_id){
        return this.http.delete(this.baseUrl+'/'+chantier_id);
    }
    export(filters){
        var queryString = Object.keys(filters)
            .filter(key => filters[key])
            .map(key => key + '=' + filters[key])
            .join('&');
        var url = this.baseUrl+'/export?'+queryString+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }
    addSignatures(ar_id, signatures){
        return this.http.post(this.baseUrl+'/'+ar_id+'/signatures', signatures);
    }
    
}
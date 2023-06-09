
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Causerie } from '@app/core/models/';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class CauserieService{

    baseUrl = environment.apiBaseUrl+'causeries';
    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    getAll(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
    }
    getList(){
        return this.http.get<JsonResponse<Causerie[]>>(this.baseUrl+'/mini');
    }
    getListGrouped(){
        return this.http.get<JsonResponse<Causerie[]>>(this.baseUrl+'/mini?grouped=true');
    }
    get(item_id){
        return this.http.get<JsonResponse<Causerie>>(this.baseUrl+'/'+item_id);
    }
    create(formData){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post<JsonResponse<Causerie>>(this.baseUrl+'/'+'create', formData, { headers: httpHeaders });
    }
    update(id: number, formData){
        const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post<JsonResponse<Causerie>>(this.baseUrl+'/update/'+id, formData, { headers: httpHeaders });
    }
    delete(item_id){
        return this.http.delete<JsonResponse<Causerie>>(this.baseUrl+'/'+item_id);
    }
    
    addParticipant(causerieId: number, params: any){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/'+causerieId+'/participant', params);
    }
    addParticipants(causerieId: number, params: any){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/'+causerieId+'/participants', params);
    }

    addFeedBackParticipant(causerieId: number, userId: number, params: any){
        return this.http.put<JsonResponse<any>>(this.baseUrl+'/'+causerieId+'/participant/'+userId, params);
    }

    detachParticipant(causerieId: number, userId: number){
        return this.http.delete<JsonResponse<any>>(this.baseUrl+'/'+causerieId+'/participant/'+userId);
    }
    
    export(filters){
        var queryString = Object.keys(filters).map(key => key + '=' + filters[key]).join('&');
        var url = this.baseUrl+'/export?'+queryString+'&entity='+localStorage.getItem(environment.entity)+'&token='+localStorage.getItem(environment.authTokenKey);
        window.open(url, '_blank');
    }

    getStats(params){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/stats', params);
    }

    addDocuments(id:number, documents){
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "multipart/form-data");
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/'+id+'/documents', documents, { headers: httpHeaders });
    }
    

}
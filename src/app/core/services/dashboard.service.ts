
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class DashboardService extends HttpService{

    baseUrl = environment.apiBaseUrl+'dashboards';
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAllStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl, {...params});
    }

    getChantierStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/chantiers', {...params});
    }

    getArStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/analyses-risque', {...params});
    }

    getVsStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/visites', {...params});
    }

    getActionStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/actions', {...params});
    }
    
    getEntrepriseStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/entreprises', {...params});
    }

    getMaterielStats(params = {}){
        return this.http.post<JsonResponse<any[]>>(this.baseUrl+'/materiel', {...params});
    }
    
}
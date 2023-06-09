
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient } from '@angular/common/http'
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { Personnel } from '../models';


export class PersonnelService extends HttpService{

  baseUrl = environment.apiBaseUrl+'personnels';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getList(){
    return this.http.get<JsonResponse<Personnel[]>>(this.baseUrl+"/mini");
  }

  getAll(params = {}){
		return this.http.post<JsonResponse<any>>(this.baseUrl, {...params});
  }

  getUserById(personnelId: number){
		return this.http.get<JsonResponse<Personnel>>(this.baseUrl + `/${personnelId}`);
  }

  getPersonnelByPeriod(personnelId: number, periodId){
		return this.http.get<JsonResponse<Personnel>>(this.baseUrl + `/${personnelId}/period/${periodId}`);
  }

  getPersonnelActualPeriod(personnelId: number){
		return this.http.get<JsonResponse<Personnel>>(this.baseUrl + `/${personnelId}/actual-period`);
  }

  setMetrics(personnelId, params){
    return this.http.post<JsonResponse<Personnel>>(this.baseUrl+'/'+personnelId+'/metric', params);
  }

  getStats(params){
    return this.http.post<JsonResponse<any>>(this.baseUrl+'/stats', params);
  }

  create(personnel){
    return this.http.post<JsonResponse<Personnel>>(this.baseUrl+'/'+'create', personnel);
  }

  
}

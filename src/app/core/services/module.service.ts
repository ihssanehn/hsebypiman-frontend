import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';
import { isSuccess } from 'angular-in-memory-web-api';

@Injectable()
export class ModuleService extends HttpService {

    baseUrl = environment.apiBaseUrl+'modules';
    
    constructor(
        private http: HttpClient,
        private permissionsService: NgxPermissionsService,
        private router: Router
    ) {
        super();
    }
    
	private currentModulesSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentModules')));
	public currentModules = this.currentModulesSubject
		.asObservable()
		.pipe(distinctUntilChanged());

	public get currentModulesValue(): any{
		return this.currentModulesSubject.value;
    }
    
   
    getModules(){
        return this.http.get<any>(`${this.baseUrl}`)
        .pipe(
            map(
                res=> {
                    localStorage.setItem('currentModules', JSON.stringify(res.result.data));
                    this.currentModulesSubject.next(res.result.data);
                    return res;
                }
            )
        );
    }    
    
    isActived(params){ 
        var test =  params.every((val) => this.currentModulesSubject.value.includes(val))
        return test;
    }

	async populate(moduleCodes) {
        if(!this.currentModulesSubject.value){
            let res = await this.getModules().toPromise();
            if(res){
                return this.isActived(moduleCodes)                
            }else{
                return false;
            }
        }else{
            let res = await this.getModules().toPromise();
            return this.isActived(moduleCodes);
        }
	}

}

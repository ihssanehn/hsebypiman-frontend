import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpService } from '@app/core/services/http-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Injectable()
export class ModuleService extends HttpService {

    baseUrl = environment.apiBaseUrl+'modules';
    
    
    private currentModulesSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentModules')));

    public currentModules = this.currentModulesSubject
		.asObservable()
		.pipe(distinctUntilChanged());

    public get currentModulesValue(): any{
        return this.currentModulesSubject.value;
    }
    
        
    constructor(
        private http: HttpClient,
        private permissionsService: NgxPermissionsService,
        private router: Router
    ) {
        super();
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

    getModulesAsAdmin(){
        return this.http.get<any>(`${this.baseUrl}?as_admin=true`)
    }    
    
    updateModules(params){
        return this.http.put<any>(this.baseUrl+'/update-all', params);
    }

    isActived(params){ 
        if(params){
            if(!this.currentModulesSubject.value){
                return this.populate(params);
            }
            var test =  params.every((val) => this.currentModulesSubject.value.includes(val))
            return test;
        }else{
            return false;
        }
    }

    inModules(params){ 
        if(!this.currentModulesSubject.value){
            return this.populate(params);
        }
        const modules = this.currentModulesSubject.value;
        var test =  modules.filter(module =>  params.includes(module));
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

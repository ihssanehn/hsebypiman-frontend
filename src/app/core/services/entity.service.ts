
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { Type } from '@app/core/models/type.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Router } from '@angular/router';

export class EntityService extends HttpService{

    baseUrl = environment.apiBaseUrl+'entities';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getList(){
        return this.http.get<JsonResponse<Type[]>>(this.baseUrl+"/mini");
    }

}
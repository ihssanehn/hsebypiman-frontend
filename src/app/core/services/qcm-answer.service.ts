import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { QcmAnswer } from '@app/core/models';
import { Paginate } from '@app/core/_base/layout/models/paginate.model'
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model'
import { Router } from '@angular/router';

export class QcmAnswerService extends HttpService{

    baseUrl = environment.apiBaseUrl+'qcm-answers';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<QcmAnswer>>>(this.baseUrl, {...params});
    }
    getList(): Observable<JsonResponse<QcmAnswer[]>> {
		return this.http.get<JsonResponse<QcmAnswer[]>>(this.baseUrl+'/mini');
	}
    get(qcm_answer_id){
        return this.http.get<JsonResponse<QcmAnswer>>(this.baseUrl+'/'+qcm_answer_id);
    }
    create(qcmAnswer){
        return this.http.post<JsonResponse<any>>(this.baseUrl+'/'+'create', qcmAnswer);
    }
    update(qcmAnswer){
        return this.http.put<JsonResponse<QcmAnswer>>(this.baseUrl+'/'+qcmAnswer.id, qcmAnswer);
    }
    delete(qcm_answer_id){
        return this.http.delete(this.baseUrl+'/'+qcm_answer_id);
    }
    
}
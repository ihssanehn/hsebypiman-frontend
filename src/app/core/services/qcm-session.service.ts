import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { QcmSession } from '@app/core/models';
import { Paginate } from '@app/core/_base/layout/models/paginate.model'
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model'
import { Router } from '@angular/router';

export class QcmSessionService extends HttpService{

    private _currentQcmSession = new BehaviorSubject<QcmSession>(null);
    private _currentChapterIndex = new BehaviorSubject<number>(0);

    baseUrl = environment.apiBaseUrl+'qcm-sessions';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super()
    }

    set currentQcmSession(value) {
        this._currentQcmSession.next(value);
    }

    get currentQcmSession() {
        return this._currentQcmSession.getValue();
    }

    set currentChapterIndex(value) {
        this._currentChapterIndex.next(value);
    }

    get currentChapterIndex() {
        return this._currentChapterIndex.getValue();
    }

    getChapterQuestions(idChapter: number) {
        return this.currentQcmSession.qcm.chapters.find(chapter => chapter.id == idChapter);
    }

    getAll(params){
        return this.http.post<JsonResponse<Paginate<QcmSession>>>(this.baseUrl, {...params});
    }
    getList(): Observable<JsonResponse<QcmSession[]>> {
		return this.http.get<JsonResponse<QcmSession[]>>(this.baseUrl+'/mini');
	}
    get(qcm_session_id){
        return this.http.get<JsonResponse<QcmSession>>(this.baseUrl+'/'+qcm_session_id);
    }
    create(qcmSession){
        return this.http.post<JsonResponse<QcmSession>>(this.baseUrl+'/'+'create', qcmSession);
    }
    update(qcmSession){
        return this.http.put<JsonResponse<QcmSession>>(this.baseUrl+'/'+qcmSession.id, qcmSession);
    }
    delete(qcm_session_id){
        return this.http.delete(this.baseUrl+'/'+qcm_session_id);
    }
    
}
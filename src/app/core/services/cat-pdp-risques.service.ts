
import {environment} from '@env/environment';
import {HttpService} from '@app/core/services/http-service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import {map} from 'rxjs/operators';


export class CatPdpRisquesService extends HttpService {

	baseUrl = environment.apiBaseUrl + 'cat_pdp_risques';

	constructor(
		private http: HttpClient,
		private router: Router
	) {
		super();
	}

	getAll(params = {}) {
		return this.http.post<JsonResponse<any[]>>(this.baseUrl, {...params});
	}

	getAllAsAdmin(params = {}) {
		const extendparams = {...params};
		extendparams['fromAdmin'] = true;
		return this.http.post<JsonResponse<any[]>>(this.baseUrl, {...extendparams});
	}

	get(item_id) {
		return this.http.get<any>(this.baseUrl + '/' + item_id)
			.pipe(map(result => result.result.data));
	}

	create(payload) {
		return this.http.post<any>(`${this.baseUrl}/create`, payload)
			.pipe(map(result => result.result.data));
	}

	update(payload) {
		return this.http.put<any>(`${this.baseUrl}/${payload.id}`, payload)
			.pipe(map(result => result.result.data));
	}

	delete(id) {
		return this.http.delete<any>(`${this.baseUrl}/${id}`)
			.pipe(map(result => result.result.data));
	}

	updateOrders(payload) {
		return this.http.post<any>(`${environment.apiBaseUrl}updateOrders`, payload);
	}


}

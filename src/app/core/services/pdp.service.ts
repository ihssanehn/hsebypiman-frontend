
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {HttpService} from '@app/core/services/http-service';
import {Ar} from '@app/core/models/ar.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import { Pdp} from "@app/core/models";

export class PdpService extends HttpService {

	baseUrl = environment.apiBaseUrl + 'prevention_plan';
	filtersUrl = environment.apiBaseUrl + 'filters';

	constructor(
		private http: HttpClient
	) {
		super();
	}

	getAll(params) {
		return this.http.post<JsonResponse<Paginate<Ar>>>(this.baseUrl, {...params});
	}

	getAllPdpFilters() {
		return this.http.get<JsonResponse<any[]>>(this.filtersUrl);
	}

	getAllAsAdmin(route, params = {}) {
		var extendparams = {...params}
		extendparams['fromAdmin'] = true;
		return this.http.post<JsonResponse<Pdp[]>>(environment.apiBaseUrl + route, {...extendparams});
	}

	create(pdp) {
		return this.http.post<JsonResponse<Pdp>>(this.baseUrl + '/' + 'create', pdp);
	}

	update(pdp, pdp_id = undefined) {
		if (pdp_id) {
			const httpHeaders = new HttpHeaders();
			httpHeaders.set("Content-Type", "multipart/form-data");
			return this.http.post<JsonResponse<Pdp>>(this.baseUrl + '/' + pdp_id, pdp, {headers: httpHeaders});
		} else {

			return this.http.put<JsonResponse<Pdp>>(this.baseUrl + '/' + pdp.id, pdp);
		}

	}

	get(pdp_id) {
		return this.http.get<JsonResponse<Pdp>>(this.baseUrl + '/' + pdp_id);
	}

	delete(pdp_id) {
		return this.http.delete(this.baseUrl + '/' + pdp_id);
	}

	export(filters) {
		const queryString = Object.keys(filters)
			.filter(key => filters[key])
			.map(key => key + '=' + filters[key])
			.join('&');
		const url = this.baseUrl + '/export?' + queryString + '&token=' + localStorage.getItem(environment.authTokenKey);
		window.open(url, '_blank');
	}

	exportPdpPdf(pdp_id) {
		const url = this.baseUrl + '/' + pdp_id + '/pdf?token=' + localStorage.getItem(environment.authTokenKey);
		window.open(url, '_blank');
	}

	updateOrders(payload) {
		return this.http.post<any>(`${environment.apiBaseUrl}/updateOrders`, payload)
	}

	addValidationSignatures(pdp_id, signatures) {
		return this.http.post(this.baseUrl + '/' + pdp_id + '/validations/signatures', signatures);
	}

	addIntervenantSignatures(pdp_id, signatures) {
		return this.http.post(this.baseUrl + '/' + pdp_id + '/intervenants/signatures', signatures);
	}

	removeValidationsSignatures(pdp_id) {
		return this.http.delete(this.baseUrl + '/' + pdp_id + '/validations/signatures');
	}

	getStatus() {
		return this.http.get(this.baseUrl + '/status');
	}

	changeStatus(pdp_id, status) {
		return this.http.post(this.baseUrl + '/' + pdp_id + '/status', status);
	}

	duplicatePdp(pdp_id) {
		return this.http.get(this.baseUrl + '/' + pdp_id + '/duplicate');
	}

}

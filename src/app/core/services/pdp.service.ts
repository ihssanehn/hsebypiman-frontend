import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, BehaviorSubject} from 'rxjs';
import {catchError, map, distinctUntilChanged} from 'rxjs/operators';
import {QueryParamsModel, QueryResultsModel} from '../_base/crud';
import {environment} from '@env/environment';
import {HttpService} from '@app/core/services/http-service';
import {NgxPermissionsService} from 'ngx-permissions';
import {Ar} from '@app/core/models/ar.model';
import {Paginate} from '@app/core/_base/layout/models/paginate.model';
import {JsonResponse} from '@app/core/_base/layout/models/jsonResponse.model';
import {Router} from '@angular/router';
import {CatRisque, ConsigneModel, Equipement, Pdp} from "@app/core/models";

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

	update(pdp) {
		return this.http.put<JsonResponse<Pdp>>(this.baseUrl + '/' + pdp.id, pdp);
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

	updateOrders(payload) {
		return this.http.post<any>(`${environment.apiBaseUrl}/updateOrders`, payload)
	}

	addSignatures(pdp_id, signatures){
        return this.http.post(this.baseUrl+'/'+pdp_id+'/signatures', signatures);
    }
}

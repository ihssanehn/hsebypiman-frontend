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
import {CatRisque, ConsigneModel} from "@app/core/models";

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

	create(pdp) {
		return this.http.post<JsonResponse<Ar>>(this.baseUrl + '/' + 'create', pdp);
	}
}

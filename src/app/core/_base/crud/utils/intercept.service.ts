// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// RxJS
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {

	// intercept request and add token
	public constructor(private router: Router,
		private translate: TranslateService,
	) {}

   // intercept request and add token
   intercept(
	   request: HttpRequest<any>,
	   next: HttpHandler
   ): Observable<HttpEvent<any>> {

	   // tslint:disable-next-line:no-debugger
	   // modify request
	   request = request.clone({
		   setHeaders: {
			   Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`,
			   // We could have used translationService.getSelectedLang but injecting that service causes a circular dependency
			   "Accept-Language": localStorage.getItem('language') || this.translate.getDefaultLang(),
				//  "Content-Type": "application/json"
				"Entity": `${localStorage.getItem(environment.entity)}`
		   }
	   });


	   return next.handle(request).pipe(catchError((errorResponse: HttpErrorResponse) => {
			const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;

			if (errorResponse.status === 401 ) {
				if(error.error.message.content == "token_cannot_be_refreshed") {
					const cloneRequest = request.clone({
						setHeaders: {
							Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`,
							"Accept-Language": localStorage.getItem('language') || this.translate.getDefaultLang(),
						}
					});
					return next.handle(cloneRequest);

				} else {
					switch (error.error.message.content) {
						case "token_expired":
							console.log("token_expired");
							localStorage.removeItem(environment.authTokenKey);
							localStorage.removeItem(environment.entity);
							this.router.navigate(['/auth/login']);
							break;
						case "token_invalid":
							localStorage.removeItem(environment.authTokenKey);
							localStorage.removeItem(environment.entity);
							this.router.navigate(['/auth/login']);
							break;
						case "token_absent":
							localStorage.removeItem(environment.authTokenKey);
							localStorage.removeItem(environment.entity);
							this.router.navigate(['/auth/login']);
							break;
						case "token_blacklisted":
							localStorage.removeItem(environment.authTokenKey);
							localStorage.removeItem(environment.entity);
							this.router.navigate(['/auth/login']);
							break;
						case "Unauthenticated.":
							localStorage.removeItem(environment.authTokenKey);
							localStorage.removeItem(environment.entity);
							this.router.navigate(['/auth/login']);
							break;
						default:
							localStorage.removeItem(environment.authTokenKey);
							localStorage.removeItem(environment.entity);
							this.router.navigate(['/auth/login']);
							break;
					}
			   }
			}

			return throwError(error);
		}));
   }
}

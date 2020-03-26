// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
			   "Accept-Language": localStorage.getItem('language') || this.translate.getDefaultLang()
		   }
	   });
	   // console.log('----request----');
	   // console.log(request);
	   // console.log('--- end of request---');

	   return next.handle(request).pipe(
		   tap(
			   event => {
					if (event instanceof HttpResponse) {
					   // console.log('all looks good');
					   // http response status code
					   // console.log(event.status);
				   }
			   },
			   error => {
				   if (error.status === 401 ) {
					   switch (error.error.message) {
						   case "token_expired":
						   case "token_invalid":
						   case "token_absent":
						   case "Unauthenticated.":
							   localStorage.removeItem(environment.authTokenKey);
							   this.router.navigate(['/auth/login']);
						   break;
					   }
				   } else if(error.status === 403){
					//    this.notificationService.warning("Unauthorized", "Not allowed area");
				   }
			   }
		   )
	   );
   }
}

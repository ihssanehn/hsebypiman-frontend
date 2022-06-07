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
export class RefreshTokenIntercept implements HttpInterceptor {

	public constructor(
		private router: Router
	) {}


   intercept(
	   request: HttpRequest<any>,
	   next: HttpHandler
   ): Observable<HttpEvent<any>> {

	   return next.handle(request).pipe(
		   tap(
			   event => {
					if (event instanceof HttpResponse) {
						var refreshedToken = event.headers.get("Authorization");
						if(refreshedToken) {
							localStorage.setItem(environment.authTokenKey, refreshedToken)
						}
				   }
			   }
		   )
	   );
   }
}

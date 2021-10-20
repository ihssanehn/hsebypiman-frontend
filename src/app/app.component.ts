import { Subscription } from 'rxjs';
// Angular
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { LayoutConfigService, SplashScreenService, TranslationService, VersionCheckService } from './core/_base/layout';
// language list
import { locale as frLang } from './core/_config/i18n/fr';
import { locale as enLang } from './core/_config/i18n/en';
import { locale as chLang } from './core/_config/i18n/ch';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as jpLang } from './core/_config/i18n/jp';
import { locale as deLang } from './core/_config/i18n/de';
import { environment } from '@env/environment';
import { AuthService } from './core/auth';
import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[tf-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
	// Public properties
	title = 'PIMAN - HSE';
	loader: boolean;
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(private translationService: TranslationService,
				         private router: Router,
				         private layoutConfigService: LayoutConfigService,
						 private splashScreenService: SplashScreenService,
						 private authService : AuthService,
						 private versionCheckService : VersionCheckService,
						 private ngxRolesService : NgxRolesService,
						 private ngxPermService:NgxPermissionsService
	) {

		// register translations
		this.translationService.loadTranslations(frLang, enLang, chLang, esLang, jpLang, deLang);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	async ngOnInit() {
		// enable/disable loader
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		// Load permissions
		this.authService.currentUser.subscribe((user) => {
			if(user){
				var permissions = user.role.permissions.map(x => x.code);
				this.authService.loadUserPermissions(permissions);
				this.authService.loadUserRole(user.role.code,permissions);
			}
		});
		

		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// hide splash screen
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);
				
				this.versionCheckService.checkVersion(environment.versionCheckURL)
				// to display back the body content
				setTimeout(() => {
					document.body.classList.add('tf-page--loaded');
				}, 500);
			}
		});
		this.unsubscribe.push(routerSubscription);
		// await this.authService.populate();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}

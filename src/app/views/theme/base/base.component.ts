// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, MenuConfigService, PageConfigService } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { LayoutConfig } from '../../../core/_config/layout.config';
import { MenuConfig } from '../../../core/_config/menu.config';
import { PageConfig } from '../../../core/_config/page.config';
// User permissions
import { NgxPermissionsService } from 'ngx-permissions';
import { NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
	selector: 'tf-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
	// Public variables
	currentRouteUrl = '';
	selfLayout: string;
	asideDisplay: boolean;
	asideSecondary: boolean;
	subheaderDisplay: boolean;
	fluid: boolean;

	// Private properties
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 * @param menuConfigService: MenuConfifService
	 * @param pageConfigService: PageConfigService
	 * @param htmlClassService: HtmlClassService
	 * @param store
	 * @param permissionsService
	 */
	constructor(
		private layoutConfigService: LayoutConfigService,
		private menuConfigService: MenuConfigService,
		private pageConfigService: PageConfigService,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private htmlClassService: HtmlClassService,
		private permissionsService: NgxPermissionsService) {


			
		// register configs by demos
		this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
		this.menuConfigService.loadConfigs(new MenuConfig().configs);
		this.pageConfigService.loadConfigs(new PageConfig().configs);

		// setup element classes
		this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

		const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(layoutConfig => {
			// reset body class based on global and page level layout config, refer to html-class.service.ts
			document.body.className = '';
			this.htmlClassService.setConfig(layoutConfig);
			
		});
		this.unsubscribe.push(subscr);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();
		this.selfLayout = objectPath.get(config, 'self.layout');
		this.asideDisplay = objectPath.get(config, 'aside.self.display');
		this.asideSecondary = objectPath.get(config, 'aside-secondary.self.display');
		this.subheaderDisplay = objectPath.get(config, 'subheader.display');
		this.fluid = objectPath.get(config, 'content.width') === 'fluid';


		this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
				this.cdr.markForCheck();
			});


		// let the layout type change
		const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
			setTimeout(() => {
				this.selfLayout = objectPath.get(cfg, 'self.layout');
			});
		});
		this.unsubscribe.push(subscr);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}



}

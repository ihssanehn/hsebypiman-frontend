// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import objectPath from 'object-path';
import { HtmlClassService } from '@app/views/theme/html-class.service';
import { ModuleService } from '@app/core/services/module.service';

@Component({
	selector: 'tf-subheader4',
	templateUrl: './subheader4.component.html',
	styleUrls: ['./subheader4.component.scss']
})
export class Subheader4Component implements OnInit, OnDestroy, AfterViewInit {
	// Public properties
	@Input() fluid: boolean;
	@Input() clear: boolean;

	today: number = Date.now();
	title = '';
	desc = '';
	breadcrumbs: Breadcrumb[] = [];
	currentRouteUrl: any = '';

	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		public subheaderService: SubheaderService,
		public htmlClassService: HtmlClassService,
		private router: Router,
		private moduleService: ModuleService,
		private cdr: ChangeDetectorRef
	) {
		this.moduleService.currentModules.subscribe((event) => {
			this.cdr.markForCheck();
		})
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {

		this.currentRouteUrl = this.router.url;
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				this.currentRouteUrl = this.router.url;
				this.cdr.markForCheck();
			});
	}

	/**
	 * Return Css Class Name
	 * @param item: any
	 */
	getItemCssClasses(item) {
		let classes = 'tf-menu__item';

		if (this.isMenuItemIsActive(item)) {
			classes += ' tf-menu__item--active tf-menu__item--here';
		}

		classes += ' tf-menu__item--rel';

		const customClass = objectPath.get(item, 'custom-class');
		if (customClass) {
			classes += ' ' + customClass;
		}

		if (objectPath.get(item, 'icon-only')) {
			classes += ' tf-menu__item--icon-only';
		}

		return classes;
	}

	/**
	 * Check Menu is active
	 * @param item: any
	 */
	isMenuItemIsActive(item): boolean {

		if (!item.page) {
			return false;
		}

		let urlPath = this.clearUrl(this.currentRouteUrl);
		let submodulePath = this.clearUrl(item.page);
		
		return submodulePath == urlPath;
	}

	/**
	 * Clear URL
	 */
	clearUrl(path){
		var urls = path.split('/');
		var url = urls.splice(0, 3);
		let urlPath = url.join('/');

		return urlPath;
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
			// breadcrumbs title sometimes can be undefined
			if (bt) {
				Promise.resolve(null).then(() => {
					this.title = bt.title;
					this.desc = bt.desc;
				});
			}
		}));

		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
			Promise.resolve(null).then(() => {
				this.breadcrumbs = bc;
			});
		}));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
	isActiveModule(codes){
		return this.moduleService.isActived(codes);
	}

}

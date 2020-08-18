// Angular
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuAsideService, SubheaderService, MenuConfigService, LayoutConfigService } from '@app/core/_base/layout';
// Object path
import * as objectPath from 'object-path';
import { filter } from 'rxjs/operators';
import { HtmlClassService } from '@app/views/theme/html-class.service';
import { ModuleService } from '@app/core/services';

@Component({
	selector: 'tf-admin-visites',
	templateUrl: './admin-visites.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminVisitesComponent implements OnInit {

	subnav: Array<any>
	currentRouteUrl: any = '';
	
	layout: string;
	fluid: boolean;
	clear: boolean;

	constructor(
		private router:Router,
		private menuConfigService: MenuConfigService,
		public htmlClassService: HtmlClassService,
		private moduleService:ModuleService,
		private cdr:ChangeDetectorRef,
		private layoutConfigService:LayoutConfigService
	) {
	}

	ngOnInit(){
		this.subnav = objectPath.get(this.menuConfigService.getMenus(), 'subheader.admin-visites.items');

		this.loadConfig();

		this.currentRouteUrl = this.router.url;

		this.router.events
		.pipe(filter(event => event instanceof NavigationEnd))
		.subscribe(event => {
			this.currentRouteUrl = this.router.url;
			this.cdr.markForCheck();
		});
	}

	loadConfig(){
		const config = this.layoutConfigService.getConfig();
		this.layout = objectPath.get(config, 'subheader.layout');
		this.fluid = objectPath.get(config, 'footer.self.width') === 'fluid';
		this.clear = objectPath.get(config, 'subheader.clear');
	} 

	goTo(path){
		this.router.navigate(path);
	}

	isActiveModule(codes){
		return this.moduleService.isActived(codes);
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
		var url = urls.splice(0, 4);
		let urlPath = url.join('/');

		return urlPath;
	}


}

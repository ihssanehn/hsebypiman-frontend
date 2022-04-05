// Angular
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	Renderer2
} from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import {
	LayoutConfigService,
	MenuConfigService,
	MenuHorizontalService,
	MenuOptions,
	OffcanvasOptions,
	SubheaderService
} from '../../../../core/_base/layout';
// HTML Class
import { HtmlClassService } from '../../html-class.service';

import { ModuleService } from '@app/core/services/module.service';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

@Component({
	selector: 'tf-menu-horizontal',
	templateUrl: './menu-horizontal.component.html',
	styleUrls: ['./menu-horizontal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
	// Public properties
	currentRouteUrl: any = '';

	rootArrowEnabled: boolean;

	menuOptions: MenuOptions = {
		submenu: {
			desktop: 'dropdown',
			tablet: 'accordion',
			mobile: 'accordion'
		},
		accordion: {
			slideSpeed: 200, // accordion toggle slide speed in milliseconds
			expandAll: false // allow having multiple expanded accordions in the menu
		},
		dropdown: {
			timeout: 50
		}
	};

	offcanvasOptions: OffcanvasOptions = {
		overlay: true,
		baseClass: 'tf-header-menu-wrapper',
		closeBy: 'tf_header_menu_mobile_close_btn',
		toggleBy: {
			target: 'tf_header_mobile_toggler',
			state: 'tf-header-mobile__toolbar-toggler--active'
		}
	};

	permissions;
	roles;

	/**
	 * Component Conctructor
	 *
	 * @param el: ElementRef
	 * @param htmlClassService: HtmlClassService
	 * @param menuHorService: MenuHorService
	 * @param menuConfigService: MenuConfigService
	 * @param layoutConfigService: LayouConfigService
	 * @param router: Router
	 * @param render: Renderer2
	 * @param cdr: ChangeDetectorRef
	 */
	constructor(
		private el: ElementRef,
		public htmlClassService: HtmlClassService,
		public menuHorService: MenuHorizontalService,
		private menuConfigService: MenuConfigService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private render: Renderer2,
		public moduleService: ModuleService,
		private cdr: ChangeDetectorRef,
		private ngxPermissionsService: NgxPermissionsService,
		private ngxRolesService: NgxRolesService,
	) {
		this.moduleService.currentModules.subscribe((event) => {
			this.cdr.markForCheck();
		})
		this.ngxPermissionsService.permissions$.subscribe((event) => {
			this.cdr.markForCheck();
		})
		this.ngxRolesService.roles$.subscribe((event) => {
			this.cdr.markForCheck();
		})
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		
		// this.ngxPermissionsService.permissions$.subscribe(x=>{
		// 	this.permissions = Object.keys(x);
		// 	this.cdr.markForCheck();
		// })
		// this.ngxRolesService.roles$.subscribe(x=>{
		// 	this.roles = Object.keys(x);
		// 	this.cdr.markForCheck();
		// })
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.root-arrow');

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

		if (objectPath.get(item, 'submenu')) {
			classes += ' tf-menu__item--submenu';
		}

		if (!item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' tf-menu__item--active tf-menu__item--here';
		}

		if (item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' tf-menu__item--open tf-menu__item--here';
		}

		if (objectPath.get(item, 'resizer')) {
			classes += ' tf-menu__item--resize';
		}

		const menuType = objectPath.get(item, 'submenu.type') || 'classic';
		if ((objectPath.get(item, 'root') && menuType === 'classic')
			|| parseInt(objectPath.get(item, 'submenu.width'), 10) > 0) {
			classes += ' tf-menu__item--rel';
		}

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
	 * Returns Attribute SubMenu Toggle
	 * @param item: any
	 */
	getItemAttrSubmenuToggle(item) {
		let toggle = 'hover';
		if (objectPath.get(item, 'toggle') === 'click') {
			toggle = 'click';
		} else if (objectPath.get(item, 'submenu.type') === 'tabs') {
			toggle = 'tabs';
		} else {
			// submenu toggle default to 'hover'
		}

		return toggle;
	}

	/**
	 * Returns Submenu CSS Class Name
	 * @param item: any
	 */
	getItemMenuSubmenuClass(item) {
		let classes = '';

		const alignment = objectPath.get(item, 'alignment') || 'right';

		if (alignment) {
			classes += ' tf-menu__submenu--' + alignment;
		}

		const type = objectPath.get(item, 'type') || 'classic';
		if (type === 'classic') {
			classes += ' tf-menu__submenu--classic';
		}
		if (type === 'tabs') {
			classes += ' tf-menu__submenu--tabs';
		}
		if (type === 'mega') {
			if (objectPath.get(item, 'width')) {
				classes += ' tf-menu__submenu--fixed';
			}
		}

		if (objectPath.get(item, 'pull')) {
			classes += ' tf-menu__submenu--pull';
		}

		return classes;
	}

	isActiveModule(codes){
		return this.moduleService.isActived(codes);
	}

	/**
	 * Check Menu is active
	 * @param item: any
	 */
	isMenuItemIsActive(item): boolean {
		if (item.submenu) {
			return this.isMenuRootItemIsActive(item);
		}

		if (!item.page) {
			return false;
		}

		var test = this.currentRouteUrl.split('/');
		var page = item.page.split('/');
		return page[1] == test[1];
	}

	/**
	 * Check Menu Root Item is active
	 * @param item: any
	 */
	isMenuRootItemIsActive(item): boolean {
		if (item.submenu.items) {
			for (const subItem of item.submenu.items) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		if (item.submenu.columns) {
			for (const subItem of item.submenu.columns) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		if (typeof item.submenu[Symbol.iterator] === 'function') {
			for (const subItem of item.submenu) {
				const active = this.isMenuItemIsActive(subItem);
				if (active) {
					return true;
				}
			}
		}

		return false;
	}

	hasChildrenClass(item){
		if(item.children){
			return 'tf-menu__item--has-children';
		}else{
			return '';
		}
	}
	// needPermission(item){
	// 	if(!item.permissionOnly){
	// 		return true;
	// 	}else{
	// 		if(this.permissions){
	// 			var hasPerm = this.permissions.filter(x=> item.permissionOnly.includes(x));
	// 			var hasRoles = this.roles.filter(x=> item.permissionOnly.includes(x));				
	// 			if(hasPerm.length > 0 || hasRoles.length > 0){
	// 				return true;
	// 			}else{
	// 				return false;
	// 			}
	// 		}else{
	// 			return false;
	// 		}
	// 	}
	// }
	needPermission(item){
		if(!item.permissionOnly){
			return true;
		}else{
			
			var hasPerm = item.permissionOnly.filter(permission =>  this.ngxPermissionsService.getPermission(permission));
			var hasRole = item.permissionOnly.filter(permission =>  this.ngxRolesService.getRole(permission));
			
			if(hasPerm.length > 0 || hasRole.length > 0){
				return true;
			}else{
				return false;
			}
		}
	}
}

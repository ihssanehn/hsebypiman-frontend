// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';
import { ModuleService } from '@app/core/services/module.service'

@Injectable()
export class MenuHorizontalService {
	// Public properties
	modules: any;
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService, private moduleService:ModuleService) {
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
		
		this.menuList$.next(menuItems);
	}

}

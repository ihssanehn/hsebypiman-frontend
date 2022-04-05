// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuAsideService {
	// Public properties
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	menuBtnAdd: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


	//Modal gestion
	pageReloaded : BehaviorSubject<boolean> = new BehaviorSubject(true);

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService) {
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items.items');
		const menuBtnAddItem: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items.btnAdd');
		this.menuList$.next(menuItems);
		this.menuBtnAdd.next(menuBtnAddItem);
	}

	loadMenuAside(path: string) {
		const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), path+'.items');
		const menuBtnAddItem: any[] = objectPath.get(this.menuConfigService.getMenus(), path+'.btnAdd');
		this.menuList$.next(menuItems);
		this.menuBtnAdd.next(menuBtnAddItem);
	}

	reload(){
		this.pageReloaded.next(!this.pageReloaded.value);
	}

}

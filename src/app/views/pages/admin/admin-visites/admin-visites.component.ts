// Angular
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MenuAsideService, SubheaderService, MenuConfigService, LayoutConfigService } from '@app/core/_base/layout';
// Object path
import * as objectPath from 'object-path';
import { filter } from 'rxjs/operators';
import { HtmlClassService } from '@app/views/theme/html-class.service';
import { ModuleService, TypeService } from '@app/core/services';

import {ThemePalette} from '@angular/material/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';

import Swal from 'sweetalert2';


@Component({
	selector: 'tf-admin-visites',
	templateUrl: './admin-visites.component.html',
	styleUrls: ['./admin-visites.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminVisitesComponent implements OnInit {

	subnav = [
		{
			title: 'Visites sécurité Chantier',
			page: 'chantiers',
			model: 'VsChantier',
			needModule: true,
			code: ['CHANTIER']
		},
		{
			title: 'Visites sécurité EPI',
			page: 'epis',
			model: 'VsEpi',
			needModule: true,
			code: ['MATERIEL']
		},
		{
			title: 'Visites sécurité Outillage',
			page: 'outillages',
			model: 'VsOutillage',
			needModule: true,
			code: ['MATERIEL']
		},
		{
			title: 'Visites sécurité Véhicule',
			page: 'vehicules',
			model: 'VsVehicule',
			needModule: true,
			code: ['MATERIEL']
		},
	]

	currentRouteUrl: any = '';
	
	layout: string;
	fluid: boolean;
	clear: boolean;
	background: ThemePalette = undefined;
	activeLink = null;
	navLinks: any[];
	types: any[];

	selectedTab: {};
	activeLinkIndex = -1; 

	tabLoadTimes: Date[] = [];

	constructor(
		private router:Router,
		private menuConfigService: MenuConfigService,
		public htmlClassService: HtmlClassService,
		private moduleService:ModuleService,
		private cdr:ChangeDetectorRef,
		private layoutConfigService:LayoutConfigService,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private typeService:TypeService,
	) {
	}

	ngOnInit(){
		this.selectTab(0);

		this.activeLink = this.subnav[0];
		this.loadConfig();
		this.router.events.subscribe((res) => {
			this.activeLinkIndex = this.subnav.indexOf(this.subnav.find(tab => './admin/visites-securite/'+tab.page === '.' + this.router.url));
		});
	}

	loadConfig(){
		const config = this.layoutConfigService.getConfig();
		this.layout = objectPath.get(config, 'subheader.layout');
		this.fluid = objectPath.get(config, 'footer.self.width') === 'fluid';
		this.clear = objectPath.get(config, 'subheader.clear');
	} 

	isActiveModule(codes){
		return this.moduleService.isActived(codes);
	}

	selectTab(event) {
		this.selectedTab = this.subnav[event].model;
		console.log(this.selectedTab)
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

	getTimeLoaded(index: number) {
		if (!this.tabLoadTimes[index]) {
		  this.tabLoadTimes[index] = new Date();
		}
	
		return this.tabLoadTimes[index];
	  }


	  showTab(index){
		  return index < 4;
	  }
}

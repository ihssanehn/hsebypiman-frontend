// Angular
import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
// Services
// Widgets model
import { LayoutConfigService, MenuAsideService } from '../../../core/_base/layout';
import { DashboardService, ModuleService } from '@app/core/services';
import { Router } from '@angular/router';

@Component({
	selector: 'tf-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy  {

	filter: any = {
		keyword: ""
	};

	constructor(
		private menuAsideService: MenuAsideService,
		private moduleService : ModuleService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		private dashboardService: DashboardService,
		protected cdr: ChangeDetectorRef
	) {
		this.menuAsideService.loadMenuAside('aside.dashboard');
	}

	ngAfterViewInit(){
	}

	ngOnInit(): void {
	}

	ngOnDestroy(){
		this.cdr.detach();
	}

	isActive(moduleName: string[]){
		return this.moduleService.isActived(moduleName);
	}
}

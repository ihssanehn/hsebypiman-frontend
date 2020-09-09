// Angular
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions, MenuAsideService } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { DashboardService, ModuleService } from '@app/core/services';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { WidgetIndicatorItemData } from '@app/views/partials/content/widgets/widget-indicator-list/widget-indicator-list.component';

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

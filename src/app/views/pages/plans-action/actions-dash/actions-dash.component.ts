import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { ActionService } from '@app/core/services';
import { Action } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;



@Component({
	selector: 'tf-actions-dash',
	templateUrl: './actions-dash.component.html',
	styleUrls: ['./actions-dash.component.scss']
})

export class ActionsDashComponent implements OnInit, AfterViewInit, OnDestroy {


	filter: any = {
		keyword: "",
		
	};
	showFilters:Boolean = false;
	stats : any;	
	
	  echartsTypeInstance;
	  echartsStatusInstance;
	  byTypeOptions = {
		title: {
		  text: 'Actions par types',
		  x: 'center'
		},
		tooltip: {
		  trigger: 'item',
		  formatter: '{b} : {c} ({d}%)'
		},
		legend: {
			type: 'scroll',
			orient: 'horizontal',
			left: 20,
			right: 20,
			bottom: 10,
			series:[]
		},
		series: [
		  {
			type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
			data: []
		  }
		]
	  };
	  byStatusOptions = {
		title: {
		  text: 'Actions par Statut',
		  x: 'center'
		},
		tooltip: {
		  trigger: 'item',
		  formatter: '{b} : {c} ({d}%)'
		},
		legend: {
			type: 'scroll',
			orient: 'horizontal',
			left: 20,
			right: 20,
			bottom: 10,
			series:[]
		},
		series: [
		  {
			type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
			data: []
		  }
		]
	  };

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected actionService: ActionService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private el: ElementRef,
	) {
		
	}

	

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.getActionsDash();
	}


	ngOnDestroy(){
		this.cdr.detach();
	}

	async getActionsDash() {
		try {
			this.actionService.getStats(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;

					// By Type
					this.byTypeOptions.series[0]['data'] = this.stats.types.total;
					this.byTypeOptions.legend['serie'] = this.stats.types.total;
					this.echartsTypeInstance.setOption(this.byTypeOptions);
					this.echartsTypeInstance.hideLoading();	
					
					// By Status
					this.byStatusOptions.series[0]['data'] = this.stats.status.total;
					this.byStatusOptions.legend['serie'] = this.stats.status.total;
					this.byStatusOptions.title.text = 'Actions par Statut';
					
					this.echartsStatusInstance.setOption(this.byStatusOptions);
					this.echartsStatusInstance.hideLoading();

					
					this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
		}
	}

	advancedSearchChanged($event){
		this.showFilters = $event;
	}

	udpateFilters(filters){
		for (let [key, value] of Object.entries(filters)) {
			this.filter[key] = value;
		}
		this.getActionsDash();
	}

	onTypeChartInit(ec) {
		this.echartsTypeInstance = ec;
		this.echartsTypeInstance.showLoading();
	}
	onStatusChartInit(ec) {
		this.echartsStatusInstance = ec;
		this.echartsStatusInstance.showLoading();
	}
	  
	resizeChart() {
		if (this.echartsTypeInstance) {
			this.echartsTypeInstance.resize();
		}
	}
}


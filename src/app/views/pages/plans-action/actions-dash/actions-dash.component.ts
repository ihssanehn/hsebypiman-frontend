import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { ActionService } from '@app/core/services';
import { Action } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { LayoutConfigService, SparklineChartOptions } from '@app/core/_base/layout';
import { Widget4Data } from '@app/views/partials/content/widgets/widget4/widget4.component';


@Component({
	selector: 'tf-actions-dash',
	templateUrl: './actions-dash.component.html',
	styleUrls: ['./actions-dash.component.scss']
})

export class ActionsDashComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('pieType', {static: true}) pieType: ElementRef;
	@ViewChild('pieStatus', {static: true}) pieStatus: ElementRef;
	@ViewChild('evolAll', {static: true}) evolAll: ElementRef;

	filter: any = {
		keyword: "",
		
	};
	
	showFilters:Boolean = false;
	stats : any;	

	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	
	

	echartsType;
	echartsStatus;
	echartsEvol;
	byTypeOptions = {
		title: {
			text: 'Actions par types',
			x: 'center'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '10%',
			containLabel: true
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
			radius: '60%',
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
	grid: {
		left: '3%',
		right: '4%',
		bottom: '10%',
		containLabel: true
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
		radius: '60%',
		center: ['50%', '50%'],
		selectedMode: 'single',
		data: []
		}
	]
	};
	EvolOptions = {
	title: {
		text: 'Evolution des actions',
		x: 'center'
	},
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '10%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		data: []
	},
	yAxis: {
		type: 'value'
	},
	
	series: [
		{
		type: 'line',
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
		private layoutConfigService: LayoutConfigService
	) {
		
	}

	

	ngOnInit() {
		this.getActionsDash();
		this.chartOptions1 = {
			data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
			color: this.layoutConfigService.getConfig('colors.state.brand'),
			border: 3
		};
		this.chartOptions2 = {
			data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
			color: this.layoutConfigService.getConfig('colors.state.danger'),
			border: 3
		};
		this.chartOptions3 = {
			data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
			color: this.layoutConfigService.getConfig('colors.state.success'),
			border: 3
		};
		this.chartOptions4 = {
			data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
			color: this.layoutConfigService.getConfig('colors.state.primary'),
			border: 3
		};

	}

	ngAfterViewInit(){
		this.echartsStatus = echarts.init(this.pieStatus.nativeElement)
		this.echartsStatus.showLoading();
		this.echartsType = echarts.init(this.pieType.nativeElement)
		this.echartsType.showLoading();
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
		this.echartsEvol.showLoading();
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
					this.byTypeOptions.series[0]['data'] = this.stats.types;
					this.echartsType.setOption(this.byTypeOptions);
					this.echartsType.hideLoading();	
					
					// By Status
					this.byStatusOptions.series[0]['data'] = this.stats.status;
					this.echartsStatus.setOption(this.byStatusOptions);
					this.echartsStatus.hideLoading();

					// Evolution
					this.EvolOptions.series[0]['data'] = this.stats.evolution;
					this.EvolOptions.xAxis.data = this.stats.evolutionAxis;
					this.echartsEvol.setOption(this.EvolOptions);
					this.echartsEvol.hideLoading();
										
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

	getClass(sens, value){
		if(value > 0.33 && value < 0.66){
			return 'text-warning';
		}
		switch (sens) {
			case 'up':
				if(value < 0.33){return 'text-danger'}else{return 'text-success'};
			case 'down':
				if(value < 0.33){return 'text-success'}else{return 'text-danger'};
		}
	}
}


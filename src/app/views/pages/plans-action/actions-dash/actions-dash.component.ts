import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActionService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';


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
	
	echartsType;
	echartsStatus;
	echartsEvol;
	byTypeOptions = {
		title: {
			text: this.translate.instant("PLANACTIONS.DASH.ACTION_BY_TYPE.TITLE"),
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
		text: this.translate.instant("PLANACTIONS.DASH.ACTION_BY_STATUS.TYPE"),
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
		text: this.translate.instant("PLANACTIONS.DASH.ACTION_EVOLUTION.TITLE"),
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
		protected actionService: ActionService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {
		
	}

	ngOnInit() {
		this.getActionsDash();
	}

	refreshTranslations(){
		this.translate.stream("PLANACTIONS.DASH.ACTION_BY_TYPE.TITLE").subscribe(x =>{
			this.byTypeOptions.title.text = x;
			this.echartsType.setOption(this.byTypeOptions);
		});
		this.translate.stream("PLANACTIONS.DASH.ACTION_BY_STATUS.TYPE").subscribe(x =>{
			this.byStatusOptions.title.text = x;
			this.echartsStatus.setOption(this.byStatusOptions);
	   });
		this.translate.stream("PLANACTIONS.DASH.ACTION_EVOLUTION.TITLE").subscribe(x =>{
			this.EvolOptions.title.text = x;
			this.echartsEvol.setOption(this.EvolOptions);
		});
	}

	ngAfterViewInit(){
		this.echartsStatus = echarts.init(this.pieStatus.nativeElement)
		this.echartsStatus.showLoading();
		this.echartsType = echarts.init(this.pieType.nativeElement)
		this.echartsType.showLoading();
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
		this.echartsEvol.showLoading();

		this.refreshTranslations();
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
				if(value <= 0.33){return 'text-danger'}else{return 'text-success'};
			case 'down':
				if(value <= 0.33){return 'text-success'}else{return 'text-danger'};
		}
	}
}


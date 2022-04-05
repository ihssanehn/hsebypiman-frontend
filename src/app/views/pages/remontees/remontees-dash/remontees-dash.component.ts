import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { RemonteeService } from '@app/core/services';
import { Remontee } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { LayoutConfigService, SparklineChartOptions } from '@app/core/_base/layout';



@Component({
	selector: 'tf-remontees-dash',
	templateUrl: './remontees-dash.component.html',
	styleUrls: ['./remontees-dash.component.scss']
})

export class RemonteesDashComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('pieType', {static: true}) pieType: ElementRef;
	@ViewChild('evolAll', {static: true}) evolAll: ElementRef;

	filter: any = {
		keyword: "",
		
	};
	
	showFilters:Boolean = false;
	stats : any;	

	echartsType;
	byTypeOptions = {
		title: {
			text: this.translate.instant("REMONTEES.DASH.LIFTS_BY_TYPE.TITLE"),
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

	echartsEvol;
	EvolOptions = {
		title: {
			text: this.translate.instant("REMONTEES.DASH.LIFTS_EVOLUTION.TITLE"),
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
		protected remonteeService: RemonteeService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private el: ElementRef,
		private layoutConfigService: LayoutConfigService
	) {
		
	}

	ngOnInit() {
		this.getRemonteesDash();
		this.echartsType = echarts.init(this.pieType.nativeElement)
		this.echartsType.showLoading();
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
		this.echartsEvol.showLoading();
	}

	ngAfterViewInit(){
		this.refreshTranslations();
	}

	refreshTranslations(){
		this.translate.stream("REMONTEES.DASH.LIFTS_BY_TYPE.TITLE").subscribe(x =>{
			 this.byTypeOptions.title.text = x;
			 this.echartsType.setOption(this.byTypeOptions);
		});
		this.translate.stream("REMONTEES.DASH.LIFTS_EVOLUTION.TITLE").subscribe(x =>{
			this.EvolOptions.title.text = x;
			this.echartsEvol.setOption(this.EvolOptions);
	   	});
	}

	ngOnDestroy(){
		this.cdr.detach();
	}

	async getRemonteesDash() {
		try {
			this.remonteeService.getStats(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;
					
					// By Type
					this.byTypeOptions.series[0]['data'] = this.stats.repartition;
					this.echartsType.setOption(this.byTypeOptions);
					this.echartsType.hideLoading();	

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
		this.getRemonteesDash();
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
	goToRemontee(event){
		this.router.navigateByUrl('remontees/detail/' + event.id);
	}
}


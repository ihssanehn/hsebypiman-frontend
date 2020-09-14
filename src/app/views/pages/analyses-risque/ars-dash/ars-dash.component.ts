import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { ArService } from '@app/core/services';
import { Ar } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { LayoutConfigService, SparklineChartOptions } from '@app/core/_base/layout';


@Component({
	selector: 'tf-ars-dash',
	templateUrl: './ars-dash.component.html',
	styleUrls: ['./ars-dash.component.scss']
})

export class ArsDashComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('pieType', {static: true}) pieType: ElementRef;
	@ViewChild('pieStatus', {static: true}) pieStatus: ElementRef;
	@ViewChild('evolAll', {static: true}) evolAll: ElementRef;

	filter: any = {
		keyword: "",
		
	};
	
	showFilters:Boolean = false;
	stats : any;	
	
	echartsEvol;
	EvolOptions = {
	title: {
		text: 'Evolution des ars',
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
		protected actionService: ArService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private el: ElementRef,
		private layoutConfigService: LayoutConfigService
	) {
		
	}

	

	ngOnInit() {
		this.getArsDash();
	}

	ngAfterViewInit(){
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
		this.echartsEvol.showLoading();
	}


	ngOnDestroy(){
		this.cdr.detach();
	}

	async getArsDash() {
		try {
			this.actionService.getStats(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;

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
		this.getArsDash();
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


import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ArService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';



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
		text: this.translate.instant("ARS.DASH.AR_EVOLUTION.TITLE"),
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
		protected actionService: ArService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {
		
	}

	ngOnInit() {
		this.getArsDash();
	}

	refreshTranslation(){
		this.translate.stream("ARS.DASH.AR_EVOLUTION.TITLE").subscribe(x =>{
			this.EvolOptions.title.text = x;
			this.echartsEvol.setOption(this.EvolOptions);
		});
	}

	ngAfterViewInit(){
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
		this.echartsEvol.showLoading();
		this.refreshTranslation();
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


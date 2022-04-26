import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { VisiteService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';


@Component({
	selector: 'tf-visites-securite-dash',
	templateUrl: './visites-securite-dash.component.html',
	styleUrls: ['./visites-securite-dash.component.scss']
})

export class VssDashComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('pieNcCat', {static: true}) pieNcCat: ElementRef;
	@ViewChild('pieVsCat', {static: true}) pieVsCat: ElementRef;
	@ViewChild('evolAll', {static: true}) evolAll: ElementRef;
	@ViewChild('evolGrp', {static: true}) evolGrp: ElementRef;

	filter: any = {
		keyword: "",
		
	};
	
	showFilters:Boolean = false;
	stats : any;	
	
	echartsEvol;
	echartsCatEvol
	
	echartsNcCat;
	echartsVsCat;

	EvolCatOptions = {
		title:{
			text: this.translate.instant("VISITES.DASH.NC_EVOLUTION_PER_CATEGORY"),
			x:'center'
		},
		color: ['#c83351', '#dea342', '#5ac2bd', '#89b398'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '4%',
			right: '2%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			data: [],
			axisLabel:
				{
						rotate:50,
						margin: 10
				},
		},
		yAxis: {
			type: 'value'
		},
		legend: {
			data: [],
			bottom: true,
			type: 'scroll',
			width: '100%'			
		},
		series: []
	};
	ncByCatOptions = {
		title: {
			text: this.translate.instant("VISITES.DASH.NC_PER_CATEGORY"),
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
			series: [],
			bottom: true,
			type: 'scroll',
			width: '100%'			
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
	vsByCatOptions = {
		title: {
			text: this.translate.instant("VISITES.DASH.VISITS_BY_CATEGORY"),
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
			series: [],
			bottom: true,
			type: 'scroll',
			width: '100%'			
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
			text: this.translate.instant("VISITES.DASH.NC_EVOLUTION"),
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
		protected VsService: VisiteService,
		protected cdr: ChangeDetectorRef,
		private translate: TranslateService,
	) {
		
	}

	ngOnInit() {
		this.getVisitesDash();
	}

	refreshTranslations(){
		this.translate.stream("VISITES.DASH.NC_EVOLUTION_PER_CATEGORY").subscribe(x =>{
			 this.EvolCatOptions.title.text = x;
			 this.echartsCatEvol.setOption(this.EvolCatOptions);
		});
		this.translate.stream("VISITES.DASH.NC_PER_CATEGORY").subscribe(x =>{
			this.ncByCatOptions.title.text = x;
			this.echartsNcCat.setOption(this.ncByCatOptions);
	   });
		this.translate.stream("VISITES.DASH.VISITS_BY_CATEGORY").subscribe(x =>{
			this.vsByCatOptions.title.text = x;
			this.echartsVsCat.setOption(this.vsByCatOptions);
		});
		this.translate.stream("VISITES.DASH.NC_EVOLUTION").subscribe(x =>{
			this.EvolOptions.title.text = x;
			this.echartsEvol.setOption(this.EvolOptions);
		});
	}

	ngAfterViewInit(){
		this.echartsNcCat = echarts.init(this.pieNcCat.nativeElement)
		this.echartsNcCat.showLoading();
		this.echartsVsCat = echarts.init(this.pieVsCat.nativeElement)
		this.echartsVsCat.showLoading();
		this.echartsEvol = echarts.init(this.evolAll.nativeElement)
		this.echartsEvol.showLoading();
		this.echartsCatEvol = echarts.init(this.evolGrp.nativeElement)
		this.echartsCatEvol.showLoading();

		this.refreshTranslations();
	}


	ngOnDestroy(){
		this.cdr.detach();
	}

	async getVisitesDash() {
		try {
			this.VsService.getStats(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;

					// NC By Cat
					this.ncByCatOptions.series[0]['data'] = this.stats.ncGroupedByCat;
					this.echartsNcCat.setOption(this.ncByCatOptions);
					this.echartsNcCat.hideLoading();	
					// VS By Cat
					this.vsByCatOptions.series[0]['data'] = this.stats.vsGroupedByCat;
					this.echartsVsCat.setOption(this.vsByCatOptions);
					this.echartsVsCat.hideLoading();
					
					// Evolution Grouped
					this.EvolCatOptions.series = [];
					if(this.stats.evolutionByCat){
						this.stats.evolutionByCat.forEach(element => {
						this.EvolCatOptions.series.push({
							name: element.name,
							type: 'bar',
							data: element.data
						});
						this.EvolCatOptions.legend.data.push(element.name);
						});
					}
					this.EvolCatOptions.xAxis.data = this.stats.evolutionAxis;
					this.echartsCatEvol.setOption(this.EvolCatOptions);
					this.echartsCatEvol.hideLoading();
		

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
		this.getVisitesDash();
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


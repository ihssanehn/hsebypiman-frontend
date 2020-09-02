// Angular
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions, MenuAsideService } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { DashboardService } from '@app/core/services';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { WidgetIndicatorItemData } from '@app/views/partials/content/widgets/widget-indicator-list/widget-indicator-list.component';

@Component({
	selector: 'tf-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy  {

	@ViewChild('pieActionStatus', {static: true}) pieActionStatus: ElementRef;
	@ViewChild('evolActions', {static: true}) evolActions: ElementRef;
	@ViewChild('evolChantiers', {static: true}) evolChantiers: ElementRef;
	@ViewChild('evolVss', {static: true}) evolVss: ElementRef;
	@ViewChild('evolNc', {static: true}) evolNc: ElementRef;
	
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data[];

	chantierIndicatorlist: WidgetIndicatorItemData[];
	
	stats : any;
	filter: any = {
		keyword: ""
	};

	echartsActionStatus;
	echartsActionEvol;
	echartsChantierEvol;
	echartsVssEvol;
	echartsNcEvol;
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
	EvolChantierOptions = {
		title: {
			text: 'Évolution des chantiers',
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
			name: 'Mois',
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
	EvolVssOptions = {
		title: {
			text: 'Évolution des visites sécurité',
			x: 'left'
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
			name: 'Mois',
			type: 'category',
			boundaryGap: false,
			data: []
		  },
		  yAxis: {
			type: 'value'
		  },
		  legend: {
			data: []
		  },
		  series: [
		  ]
	};
	EvolOptions = {
		title: {
			text: 'Évolution des actions',
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
			name: 'Mois',
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
	EvolNcOptions = {
		title: {
			text: 'Évolution des NC',
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
			name: 'Mois',
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
		private menuAsideService: MenuAsideService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		private dashboardService: DashboardService,
		protected cdr: ChangeDetectorRef
	) {
		this.menuAsideService.loadMenuAside('aside.dashboard');

	}

	ngAfterViewInit(){
		this.echartsActionStatus = echarts.init(this.pieActionStatus.nativeElement)
		this.echartsActionStatus.showLoading();
		this.echartsActionEvol = echarts.init(this.evolActions.nativeElement)
		this.echartsActionEvol.showLoading();
		this.echartsChantierEvol = echarts.init(this.evolChantiers.nativeElement)
		this.echartsChantierEvol.showLoading();
		this.echartsVssEvol = echarts.init(this.evolVss.nativeElement)
		this.echartsVssEvol.showLoading();
		this.echartsNcEvol = echarts.init(this.evolNc.nativeElement)
		this.echartsNcEvol.showLoading();
	}

	ngOnInit(): void {
		this.getDash();
	}

	ngOnDestroy(){
		this.cdr.detach();
	}

	async getDash() {
		try {
			this.dashboardService.getAll(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;

					// Chantier Indicators
					this.chantierIndicatorlist = [
						{
							title: 'Chantiers',
							desc: 'Total',
							value: this.stats.chantiers.total_chantiers,
							valueClass: 'text-success'
						}, {
							title: 'Chantiers en cours',
							desc: 'Total',
							value: this.stats.chantiers.total_chantiers_in_progress,
							valueClass: 'text-warning'
						}, {
							title: 'Chantiers terminés',
							desc: 'Total',
							value: this.stats.chantiers.total_chantiers_finished,
							valueClass: 'text-success'
						}
					];
					
					// Chantiers Evolution
					this.EvolChantierOptions.series[0]['data'] = this.stats.chantiers.total_chantiers_evolution;
					this.EvolChantierOptions.xAxis.data = this.stats.chantiers.total_chantiers_evolutionAxis;
					this.echartsChantierEvol.setOption(this.EvolChantierOptions);
					this.echartsChantierEvol.hideLoading();

					// Top 5 entreprises
					var entrepriseList = [];
					this.stats.entreprises.top_5.forEach(element => {
						entrepriseList.push({
							icon: 'flaticon2-line-chart tf-font-danger',
							title: element.raison_sociale,
							desc: element.type.libelle,
							url: 'entreprises/detail/' + element.id,
							value: element.chantiers_count,
							valueColor: 'tf-font-brand'
						});
					});
					this.widget4_4 = entrepriseList;

					// Actions By Status
					this.byStatusOptions.series[0]['data'] = this.stats.actions.status;
					this.echartsActionStatus.setOption(this.byStatusOptions);
					this.echartsActionStatus.hideLoading();

					// Actions Evolution
					this.EvolOptions.series[0]['data'] = this.stats.actions.evolution;
					this.EvolOptions.xAxis.data = this.stats.actions.evolutionAxis;
					this.echartsActionEvol.setOption(this.EvolOptions);
					this.echartsActionEvol.hideLoading();

					// Vss Evolution
					this.EvolVssOptions.series = [];
					if(this.stats.vss.total_vss_evolution){
					  this.stats.vss.total_vss_evolution.forEach(element => {
						this.EvolVssOptions.series.push({
						  type: 'line',
						  name: element.name,
						  data: element.data
						});
						this.EvolVssOptions.legend.data.push(element.name);
					  });
					}
					this.EvolVssOptions.xAxis.data = this.stats.vss.evolutionAxis;
					this.echartsVssEvol.setOption(this.EvolVssOptions);
					this.echartsVssEvol.hideLoading();

					// Nc Evolution
					this.EvolNcOptions.series[0]['data'] = this.stats.vss.total_nc_evolution;
					this.EvolNcOptions.xAxis.data = this.stats.vss.evolutionAxis;
					this.echartsNcEvol.setOption(this.EvolNcOptions);
					this.echartsNcEvol.hideLoading();

					this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
		}
	}
}

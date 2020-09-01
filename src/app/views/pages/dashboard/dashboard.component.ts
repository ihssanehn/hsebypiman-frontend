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

@Component({
	selector: 'tf-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy  {

	@ViewChild('pieActionStatus', {static: true}) pieActionStatus: ElementRef;
	@ViewChild('evolActions', {static: true}) evolActions: ElementRef;
	
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data;
	
	stats : any;
	filter: any = {
		keyword: ""
	};

	echartsActionStatus;
	echartsActionEvol;
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
	}

	ngOnInit(): void {
		this.getDash();

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

		// @ts-ignore
		this.widget4_1 = shuffle([
			{
				pic: './assets/media/files/doc.svg',
				title: 'CVTI - HSE Documentation',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/jpg.svg',
				title: 'Project Launch Evgent',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/pdf.svg',
				title: 'Full Developer Manual For 4.7',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/javascript.svg',
				title: 'Make JS Development',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/zip.svg',
				title: 'Download Ziped version OF 5.0',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/pdf.svg',
				title: 'Finance Report 2016/2017',
				url: 'https://keenthemes.com.my/metronic',
			},
		]);
		// @ts-ignore
		this.widget4_2 = shuffle([
			{
				pic: './assets/media/users/100_4.jpg',
				username: 'Anna Strong',
				desc: 'Visual Designer,Google Inc.',
				url: 'https://keenthemes.com.my/metronic',
				buttonClass: 'btn-label-brand'
			}, {
				pic: './assets/media/users/100_14.jpg',
				username: 'Milano Esco',
				desc: 'Product Designer, Apple Inc.',
				url: 'https://keenthemes.com.my/metronic',
				buttonClass: 'btn-label-warning'
			}, {
				pic: './assets/media/users/100_11.jpg',
				username: 'Nick Bold',
				desc: 'Web Developer, Facebook Inc.',
				url: 'https://keenthemes.com.my/metronic',
				buttonClass: 'btn-label-danger'
			}, {
				pic: './assets/media/users/100_1.jpg',
				username: 'Wilter Delton',
				desc: 'Project Manager, Amazon Inc.',
				url: 'https://keenthemes.com.my/metronic',
				buttonClass: 'btn-label-success'
			}, {
				pic: './assets/media/users/100_5.jpg',
				username: 'Nick Stone',
				desc: 'Visual Designer, Github Inc.',
				url: 'https://keenthemes.com.my/metronic',
				buttonClass: 'btn-label-dark'
			},
		]);
		// @ts-ignore
		this.widget4_3 = shuffle([
			{
				icon: 'flaticon-pie-chart-1 tf-font-info',
				title: 'CVTI - HSE v6 has been arrived!',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$500',
				valueColor: 'tf-font-info'
			}, {
				icon: 'flaticon-safe-shield-protection tf-font-success',
				title: 'CVTI - HSE community meet-up 2019 in Rome.',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$1260',
				valueColor: 'tf-font-success'
			}, {
				icon: 'flaticon2-line-chart tf-font-danger',
				title: 'CVTI - HSE Angular 8 version will be landing soon..',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$1080',
				valueColor: 'tf-font-danger'
			}, {
				icon: 'flaticon2-pie-chart-1 tf-font-primary',
				title: 'ale! Purchase CVTI - HSE at 70% off for limited time',
				url: 'https://keenthemes.com.my/metronic',
				value: '70% Off!',
				valueColor: 'tf-font-primary'
			}, {
				icon: 'flaticon2-rocket tf-font-brand',
				title: 'CVTI - HSE VueJS version is in progress. Stay tuned!',
				url: 'https://keenthemes.com.my/metronic',
				value: '+134',
				valueColor: 'tf-font-brand'
			}, {
				icon: 'flaticon2-notification tf-font-warning',
				title: 'Black Friday! Purchase CVTI - HSE at ever lowest 90% off for limited time',
				url: 'https://keenthemes.com.my/metronic',
				value: '70% Off!',
				valueColor: 'tf-font-warning'
			}, {
				icon: 'flaticon2-file tf-font-focus',
				title: 'CVTI - HSE React version is in progress.',
				url: 'https://keenthemes.com.my/metronic',
				value: '+13%',
				valueColor: 'tf-font-focus'
			},
		]);
		// @ts-ignore

	}

	ngOnDestroy(){
		this.cdr.detach();
	}

	async getDash() {
		try {
			this.dashboardService.getAll(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;

					// Top 5 entreprises
					var EntrepriseList = [];
					this.stats.entreprises.top_5.forEach(element => {
						EntrepriseList.push({
							icon: 'flaticon2-line-chart tf-font-danger',
							title: element.raison_sociale,
							desc: element.type.libelle,
							url: 'entreprises/detail/' + element.id,
							value: element.chantiers_count,
							valueColor: 'tf-font-brand'
						});
					});
					this.widget4_4 = EntrepriseList;

					// Actions By Status
					console.log(this.stats.actions.status);
					this.byStatusOptions.series[0]['data'] = this.stats.actions.status;
					this.echartsActionStatus.setOption(this.byStatusOptions);
					this.echartsActionStatus.hideLoading();

					// Evolution
					this.EvolOptions.series[0]['data'] = this.stats.actions.evolution;
					this.EvolOptions.xAxis.data = this.stats.actions.evolutionAxis;
					this.echartsActionEvol.setOption(this.EvolOptions);
					this.echartsActionEvol.hideLoading();

					this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
		}
	}
}

import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '@app/core/services';
import * as echarts from 'echarts';

@Component({
  selector: 'tf-visite-dash',
  templateUrl: './visite-dash.component.html',
  styleUrls: ['./visite-dash.component.scss']
})
export class VisiteDashComponent implements OnInit {

  @ViewChild('evolVss', {static: true}) evolVss: ElementRef;
  @ViewChild('evolNc', {static: true}) evolNc: ElementRef;
  @ViewChild('pieVssType', {static: true}) pieVssType: ElementRef;

  stats : any;
  filter: any = {
		keyword: ""
  };
  	echartsVssEvol;
  	echartsNcEvol;
  	EvolVssOptions = {
		tooltip: {
			trigger: 'axis'
		},
		  grid: {
			left: '1%',
			right: '6%',
			bottom: '2%',
			top: '10%',
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
		  legend: {
			data: []
		  },
		  series: [
		  ]
	};
	EvolNcOptions = {
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left: '1%',
			right: '3%',
			bottom: '2%',
			top: '4%',
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
				color: '#37a2da',
				data: []
			}
		]
	};
	echartsVssType;
	byTypeOptions = {
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

  constructor(
    private dashboardService: DashboardService,
		protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getVisiteDash();
  }

  ngAfterViewInit(){
		this.echartsVssEvol = echarts.init(this.evolVss.nativeElement)
		this.echartsVssEvol.showLoading();
		this.echartsNcEvol = echarts.init(this.evolNc.nativeElement)
		this.echartsNcEvol.showLoading();
		this.echartsVssType = echarts.init(this.pieVssType.nativeElement)
		this.echartsVssType.showLoading();
	}

  async getVisiteDash() {
		try {
			this.dashboardService.getVsStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;

			// Actions By Status
			this.byTypeOptions.series[0]['data'] = this.stats.total_vss_by_type;
			this.echartsVssType.setOption(this.byTypeOptions);
			this.echartsVssType.hideLoading();

			// Vss Evolution
			this.EvolVssOptions.series = [];
			if(this.stats.total_vss_evolution){
				this.stats.total_vss_evolution.forEach(element => {
				this.EvolVssOptions.series.push({
					type: 'line',
					name: element.name,
					data: element.data
				});
				this.EvolVssOptions.legend.data.push(element.name);
				});
			}
			this.EvolVssOptions.xAxis.data = this.stats.evolutionAxis;
			this.echartsVssEvol.setOption(this.EvolVssOptions);
			this.echartsVssEvol.hideLoading();

			// Nc Evolution
			this.EvolNcOptions.series[0]['data'] = this.stats.total_nc_evolution;
			this.EvolNcOptions.xAxis.data = this.stats.evolutionAxis;
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

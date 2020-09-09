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

  vsslabelOption = {
		show: true,
		position: 'insideTop',
		distance: -10,
		align: 'center',
		verticalAlign: 'middle',
		rotate: 0,
		formatter: '{c}',
		fontSize: 15,
		rich: {
			name: {
				textBorderColor: '#fff'
			}
		}
	};
	echartsVssEvol;
	echartsNcEvol;
	EvolVssOptions = {
		color: ['#c83351', '#dea342', '#5ac2bd', '#89b398'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '1%',
			right: '1%',
			bottom: '15%',
			top: '4%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
      boundaryGap: true,
			data: []
		},
		yAxis: {
			type: 'value'
		},
		legend: {
			data: [],
			bottom: true
		},
		series: []
	};
	EvolNcOptions = {
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left: '1%',
			right: '1%',
			bottom: '2%',
			top: '4%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
      boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				type: 'line',
				color: '#004FC2',
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
		// this.echartsVssType = echarts.init(this.pieVssType.nativeElement)
		// this.echartsVssType.showLoading();
	}

  async getVisiteDash() {
		try {
			this.dashboardService.getVsStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;

			// Actions By Status
			this.byTypeOptions.series[0]['data'] = this.stats.total_vss_by_type;
			// this.echartsVssType.setOption(this.byTypeOptions);
			// this.echartsVssType.hideLoading();

			// Vss Evolution
			this.EvolVssOptions.series = [];
			if(this.stats.total_vss_evolution){
				this.stats.total_vss_evolution.forEach(element => {
				this.EvolVssOptions.series.push({
					name: element.name,
					type: 'bar',
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
	
	getHeaderStats(){
		return ''
	}

}

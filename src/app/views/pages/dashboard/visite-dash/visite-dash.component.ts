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

  stats : any;
  filter: any = {
		keyword: ""
  };
  echartsVssEvol;
  echartsNcEvol;
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
		title: {
			text: 'Évolution des non conformité',
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
	}

  async getVisiteDash() {
		try {
			this.dashboardService.getVsStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;

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

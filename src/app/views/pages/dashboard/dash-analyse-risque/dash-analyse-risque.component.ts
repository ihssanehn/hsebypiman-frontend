import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '@app/core/services';
import * as echarts from 'echarts';

@Component({
  selector: 'tf-dash-analyse-risque',
  templateUrl: './dash-analyse-risque.component.html',
  styleUrls: ['./dash-analyse-risque.component.scss']
})
export class DashAnalyseRisqueComponent implements OnInit {

  @ViewChild('evolArs', {static: true}) evolArs: ElementRef;

  stats : any;
  filter: any = {
		keyword: ""
  };
  echartsArEvol;
  EvolArOptions = {
		tooltip: {
			trigger: 'axis',
		},
		grid: {
			left: '4%',
			right: '2%',
			bottom: '2%',
			top: '6%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
			axisLabel:
				{
						rotate:50,
						interval: 1,
						margin: 10
				},
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

  constructor(
    private dashboardService: DashboardService,
		protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getArDash();
  }

  ngAfterViewInit(){
		this.echartsArEvol = echarts.init(this.evolArs.nativeElement)
		this.echartsArEvol.showLoading();
	}

	async getArDash() {
		try {
			this.dashboardService.getArStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;

          // Ars Evolution
          this.EvolArOptions.series[0]['data'] = this.stats.total_ars_evolution;
          this.EvolArOptions.xAxis.data = this.stats.total_ars_evolutionAxis;
          this.echartsArEvol.setOption(this.EvolArOptions);
          this.echartsArEvol.hideLoading();

          this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
    }
	}
	
	getHeaderStats(){
		return 'En cours :&nbsp;<b class="text-primary">'+ this.stats.total_ars_in_progress+' / '+this.stats.total_ars+'</b>'
	}

}

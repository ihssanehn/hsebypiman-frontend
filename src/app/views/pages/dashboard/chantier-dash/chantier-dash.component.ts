import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WidgetIndicatorItemData } from '@app/views/partials/content/widgets/widget-indicator-list/widget-indicator-list.component';
import * as echarts from 'echarts';
import { DashboardService } from '@app/core/services';

@Component({
  selector: 'tf-chantier-dash',
  templateUrl: './chantier-dash.component.html',
  styleUrls: ['./chantier-dash.component.scss']
})
export class ChantierDashComponent implements OnInit {

  @ViewChild('evolChantiers', {static: true}) evolChantiers: ElementRef;

  chantierIndicatorlist: WidgetIndicatorItemData[];
  stats : any;
  filter: any = {
		keyword: ""
	};
  echartsChantierEvol;
  EvolChantierOptions = {
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			// left: '5%',
			// right: '8%',
			left: '2%',
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
				smooth: false,
				data: []
			}
		]
	};

  constructor(
    private dashboardService: DashboardService,
		protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getChantierDash();
  }

  ngAfterViewInit(){
		this.echartsChantierEvol = echarts.init(this.evolChantiers.nativeElement)
		this.echartsChantierEvol.showLoading();
	}

  async getChantierDash() {
		try {
			this.dashboardService.getChantierStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;

          // Chantier Indicators
			this.chantierIndicatorlist = [{
					title: 'Total Chantiers',
					desc: '',
					value: this.stats.total_chantiers,
					valueClass: 'text-success'
				}, {
					title: 'Total Chantiers en cours',
					desc: '',
					value: this.stats.total_chantiers_in_progress,
					valueClass: 'text-warning'
				}, {
					title: 'Total Chantiers terminés',
					desc: '',
					value: this.stats.total_chantiers_finished,
					valueClass: 'text-success'
				}
			];
			
			// Chantiers Evolution
			this.EvolChantierOptions.series[0]['data'] = this.stats.total_chantiers_evolution;
			this.EvolChantierOptions.xAxis.data = this.stats.total_chantiers_evolutionAxis;
			this.echartsChantierEvol.setOption(this.EvolChantierOptions);
			this.echartsChantierEvol.hideLoading();

          this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
    }
  }


	getHeaderStats(){
		return 'En cours :&nbsp;<b class="text-primary">'+ this.stats.total_chantiers_in_progress+' / '+this.stats.total_chantiers+'</b>'
	}

}

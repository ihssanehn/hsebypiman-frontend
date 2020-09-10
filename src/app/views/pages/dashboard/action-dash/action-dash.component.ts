import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '@app/core/services';
import * as echarts from 'echarts';

@Component({
  selector: 'tf-action-dash',
  templateUrl: './action-dash.component.html',
  styleUrls: ['./action-dash.component.scss']
})
export class ActionDashComponent implements OnInit {

  @ViewChild('pieActionStatus', {static: true}) pieActionStatus: ElementRef;
  @ViewChild('evolActions', {static: true}) evolActions: ElementRef;

  stats : any;
  filter: any = {
		keyword: ""
  };
  echartsActionStatus;
  echartsActionEvol;
  byStatusOptions = {
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
		tooltip: {
			trigger: 'axis',
			axisPointer: {            
				type: 'shadow'
		  }
		},
		grid: {
			left: '5%',
			right: '8%',
			bottom: '2%',
			top: '4%',
			containLabel: true
		},
		xAxis: {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
        type: 'bar',
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
    this.getActionDash();
  }

  ngAfterViewInit(){
		// this.echartsActionStatus = echarts.init(this.pieActionStatus.nativeElement)
    // this.echartsActionStatus.showLoading();
    this.echartsActionEvol = echarts.init(this.evolActions.nativeElement)
		this.echartsActionEvol.showLoading();
	}

  async getActionDash() {
		try {
			this.dashboardService.getActionStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;

					// Actions By Status
					this.byStatusOptions.series[0]['data'] = this.stats.status;
					// this.echartsActionStatus.setOption(this.byStatusOptions);
					// this.echartsActionStatus.hideLoading();

					// Actions Evolution
					this.EvolOptions.series[0]['data'] = this.stats.evolution;
					this.EvolOptions.xAxis.data = this.stats.evolutionAxis;
					this.echartsActionEvol.setOption(this.EvolOptions);
          this.echartsActionEvol.hideLoading();
          
          this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
    }
  }

  getHeaderStats(){
    return '<span class="text-danger">A attribuer : </span>&nbsp;<b class="text-primary">'+this.stats.actions_a_attribuer+'</b>'+'<span class="text-warning ml-4">En cours : </span>&nbsp;<b class="text-primary">'+this.stats.actions_en_cours+'</b>';
  }
}

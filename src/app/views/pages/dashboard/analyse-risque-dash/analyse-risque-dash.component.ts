import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '@app/core/services';

@Component({
  selector: 'tf-analyse-risque-dash',
  templateUrl: './analyse-risque-dash.component.html',
  styleUrls: ['./analyse-risque-dash.component.scss']
})
export class AnalyseRisqueDashComponent implements OnInit {

  stats : any;
  filter: any = {
		keyword: ""
	};

  constructor(
    private dashboardService: DashboardService,
		protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getArDash();
  }

  async getArDash() {
		try {
			this.dashboardService.getArStats(this.filter).subscribe(res=>{
          this.stats = res.result.data;
          this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
    }
  }

}

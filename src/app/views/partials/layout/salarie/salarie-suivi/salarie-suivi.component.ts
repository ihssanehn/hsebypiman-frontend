import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ModuleService, PersonnelService, PeriodService } from '@app/core/services';
import { FollowUpPeriod, Personnel } from '@app/core/models/';

@Component({
  selector: 'tf-salarie-suivi',
  templateUrl: './salarie-suivi.component.html',
  styleUrls: ['./salarie-suivi.component.scss']
})
export class SalarieSuiviComponent implements OnInit {

  @Input() userId: number;
  
  salarie: Personnel;
  period: FollowUpPeriod;
  selectedPeriodId: Number;
  periodList: FollowUpPeriod[];

  constructor(
    private personnelService: PersonnelService,
    private periodService: PeriodService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {

		this.getActualPeriod();
		this.getPeriods();
  }


	async getActualPeriod(){
		try {
			var res = await this.personnelService.getPersonnelActualPeriod(this.userId).toPromise();
			this.salarie = res.result.data;
			this.selectedPeriodId = this.salarie.period_id;
			this.cdr.markForCheck();
			
		} catch (error) {
			console.error(error);
			
		}
	}

	changePeriod(selectedPeriod)
  {
    this.selectedPeriodId = selectedPeriod;
    this.getSalarieByPeriod();
  }

	async getSalarieByPeriod(){
		try {
      var res = await this.personnelService
      .getPersonnelByPeriod(
				this.userId,
				this.selectedPeriodId
      ).toPromise();
			this.salarie = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async getPeriods(){
    var res = await this.periodService.getList().toPromise();
    this.periodList = res.result.data;
    this.cdr.markForCheck();
  }
  
	getRatingClass(rating){
		if(rating){
			if(rating >= 66){
				return 'success-progress';
			}else if(rating >= 33){
				return 'warning-progress';
			}else{
				return 'danger-progress';
			}
		}
	}


}

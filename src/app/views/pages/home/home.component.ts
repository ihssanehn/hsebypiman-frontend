// Angular
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions, MenuAsideService } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { ModuleService, PersonnelService, PeriodService } from '@app/core/services';
import { FollowUpPeriod, Personnel } from '@app/core/models/';
import {  } from '@app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '@app/core/auth';

@Component({
	selector: 'tf-home',
	templateUrl: './home.component.html',
	styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy  {

	filter: any = {
		keyword: ""
	};
	user: User;
  salarie: Personnel;
  period: FollowUpPeriod;
  selectedPeriodId: Number;
  periodList: FollowUpPeriod[];

	constructor(
		private menuAsideService: MenuAsideService,
		private moduleService : ModuleService,
    private personnelService: PersonnelService,
    private activatedRoute: ActivatedRoute,
    private periodService: PeriodService,
		private authService: AuthService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		protected cdr: ChangeDetectorRef
	) {
		this.authService.currentUser.subscribe(x=> this.user = x);
		this.menuAsideService.loadMenuAside('aside.dashboard');
	}

	ngAfterViewInit(){
	}

	ngOnInit(): void {
		this.getActualPeriod();
		this.getPeriods();
	}

	async getActualPeriod(){
		try {
			var res = await this.personnelService.getPersonnelActualPeriod(this.user.id).toPromise();
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
				this.user.id,
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
	
	getMaterielParams(){
		return this.user.role.code == 'USER' ? {'actual_user_id': this.user.id} : {};
	}
	
	ngOnDestroy(){
		this.cdr.detach();
	}

	isActive(moduleName: string[]){
		return this.moduleService.isActived(moduleName);
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

	showDetail(){
		console.log('detail');
	}

}

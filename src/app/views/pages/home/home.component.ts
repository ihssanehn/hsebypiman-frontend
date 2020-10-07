// Angular
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions, MenuAsideService } from '../../../core/_base/layout';
import { ModuleService, FlashInfoService } from '@app/core/services';
import { FlashInfo } from '@app/core/models/';
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
	flashOnTop : FlashInfo
	oldFlashList : FlashInfo[];

	constructor(
		private menuAsideService: MenuAsideService,
		private moduleService : ModuleService,
    private flashInfoService: FlashInfoService,
    private activatedRoute: ActivatedRoute,
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
		this.getFlashInfos()
	}

	async getFlashInfos(){
		var res = await this.flashInfoService.getAll({top:true, limit:5}).toPromise()
		
		this.flashOnTop = res.result.data['top'];
		this.oldFlashList = res.result.data['others'];
		this.cdr.markForCheck();
		console.log(this.flashOnTop, this.oldFlashList);
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

	showDetail(){
		console.log('detail');
	}

}

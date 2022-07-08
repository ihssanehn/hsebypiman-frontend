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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizModalComponent } from '@app/views/partials/layout/modal/quiz-modal/quiz-modal.component';
import { ShowFlashInfoModalComponent } from '@app/views/partials/layout';

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

	constructor(
		private menuAsideService: MenuAsideService,
		private moduleService : ModuleService,
    private flashInfoService: FlashInfoService,
    private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		protected cdr: ChangeDetectorRef,
		private modalService: NgbModal
	) {
		this.authService.currentUser.subscribe(x=> this.user = x);
		this.menuAsideService.loadMenuAside('aside.dashboard');
	}

	ngAfterViewInit(){
	}

	ngOnInit(): void {
		if(this.user.is_quiz_approved || !this.isActive(['QUIZ'])) {
			this.getFlashInfos()
		} else {
			this.openQuizModal();
		}
	}

	async getFlashInfos(){
		var res = await this.flashInfoService.getAll({top:true, limit:5}).toPromise()
		
		this.flashOnTop = res.result.data['top'];
		if(this.flashOnTop){
			this.openFlashInfoModal(this.flashOnTop.id)
		}
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

	openQuizModal(){
		if(this.isActive(['QUIZ'])){
			const modalRef = this.modalService.open(QuizModalComponent, {size: 'xs',scrollable: true,centered : true, windowClass: 'tf-quizz-modal__window'});
		}
	}

	openFlashInfoModal(flash_id){
		const modalRef = this.modalService.open(ShowFlashInfoModalComponent, {size: 'xl',scrollable: true, centered : true});
		modalRef.componentInstance.flashInfoId = flash_id;
	}

}

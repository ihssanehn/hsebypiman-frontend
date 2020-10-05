// Angular
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions, MenuAsideService } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { RemonteeService, DocumentService, ModuleService } from '@app/core/services';
import { Remontee } from '@app/core/models';
import { Router } from '@angular/router';

@Component({
	selector: 'tf-home',
	templateUrl: './home.component.html',
	styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy  {

	filter: any = {
		keyword: ""
	};

	last_remontees : Remontee[];

	constructor(
		private menuAsideService: MenuAsideService,
		private moduleService : ModuleService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		private remonteeService: RemonteeService,
		private documentService: DocumentService,
		protected cdr: ChangeDetectorRef
	) {
		this.menuAsideService.loadMenuAside('aside.dashboard');
	}

	ngAfterViewInit(){
	}

	ngOnInit(): void {
		this.getLastremontees()
	}
	async getLastremontees(){
		var res = await this.remonteeService.getAll({limit:3}).toPromise();
		var _remontees = res.result.data;
		_remontees.forEach(remontee=>{
			remontee.photos = remontee.documents.filter(x => ['jpg','bmp','jpeg','gif','png','tif'].indexOf(x.extension.toLowerCase()) != -1);
			remontee.photos.forEach(x=>x.src = this.documentService.readFile(x.id));
		})
		this.last_remontees = _remontees;
    this.cdr.markForCheck();
	}
	async getPhoto(remontee){
		await this.documentService.readFile(remontee.photos[0].id);
	}
	goToRemontee(remontee_id){
		return this.router.navigateByUrl('/remontees/detail/' + remontee_id);
	}
	ngOnDestroy(){
		this.cdr.detach();
	}

	isActive(moduleName: string[]){
		return this.moduleService.isActived(moduleName);
	}
}

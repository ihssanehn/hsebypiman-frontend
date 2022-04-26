import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { EntrepriseService } from '@app/core/services';
import { Router } from '@angular/router';



@Component({
	selector: 'tf-entreprises-dash',
	templateUrl: './entreprises-dash.component.html',
	styleUrls: ['./entreprises-dash.component.scss']
})

export class EntreprisesDashComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('pieType', {static: true}) pieType: ElementRef;
	@ViewChild('pieStatus', {static: true}) pieStatus: ElementRef;
	@ViewChild('evolAll', {static: true}) evolAll: ElementRef;

	filter: any = {
		keyword: "",
		
	};
	
	showFilters:Boolean = false;
	stats : any;	

	constructor(
		private router: Router,
		protected entrepriseService: EntrepriseService,
		protected cdr: ChangeDetectorRef,
	) {
		
	}

	

	ngOnInit() {
		this.getEntreprisesDash();
	}

	ngAfterViewInit(){
	}


	ngOnDestroy(){
		this.cdr.detach();
	}

	async getEntreprisesDash() {
		try {
			this.entrepriseService.getStats(this.filter).subscribe(
				res=>{
					this.stats = res.result.data;
					
					
					this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
		}
	}

	advancedSearchChanged($event){
		this.showFilters = $event;
	}

	udpateFilters(filters){
		for (let [key, value] of Object.entries(filters)) {
			this.filter[key] = value;
		}
		this.getEntreprisesDash();
	}

	getClass(sens, value){
		if(value > 0.33 && value < 0.66){
			return 'text-warning';
		}
		switch (sens) {
			case 'up':
				if(value <= 0.33){return 'text-danger'}else{return 'text-success'};
			case 'down':
				if(value <= 0.33){return 'text-success'}else{return 'text-danger'};
		}
	}
	goToEntreprise(event){
		this.router.navigateByUrl('entreprises/detail/' + event.id);
	}
}


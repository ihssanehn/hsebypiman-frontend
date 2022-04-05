import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '@app/core/services';
import { Widget4Data } from '@app/views/partials/content/widgets/widget4/widget4.component';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'tf-dash-entreprise',
  templateUrl: './dash-entreprise.component.html',
  styleUrls: ['./dash-entreprise.component.scss']
})
export class DashEntrepriseComponent implements OnInit {

  entrepriseSousTraitanteList: Widget4Data[];
  entrepriseInterimList: Widget4Data[];
  stats : any;
  header : any;
  filter: any = {
		keyword: null
	};
	raison_sociale : string;
	chiffre_affaire : string;
	visites_count : string;

  constructor(
	private dashboardService: DashboardService,
	private translate: TranslateService,
	protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
	this.translate.stream("EES.RAISON_SOCIALE.LABEL").subscribe(v => this.raison_sociale = v);
	this.translate.stream("EES.CA.SHORTTITLE").subscribe(v => this.chiffre_affaire = v);
	this.translate.stream("COMMON.DASH.VISITS_NUMBER.SHORTTITLE")
	.subscribe(v => {
		this.visites_count = v;
		this.refreshTranslation();
	});
    this.getEntrepriseDash();
  }

  refreshTranslation(){
	if(this.stats){
		this.stats.top_5_sous_traitant.shift();
		this.loadDatas();
	} 
  }

  loadDatas(){
	if(this.stats){
		this.header = {
			id: null,
			raison_sociale: this.raison_sociale,
			chiffre_affaire: this.chiffre_affaire,
			visites_count: this.visites_count,
		}
		this.stats.top_5_sous_traitant.unshift(this.header);
	}
  }

  ngAfterViewInit(){}

  async getEntrepriseDash() {
		try {
			this.dashboardService.getEntrepriseStats(this.filter).subscribe(res=>{
				this.stats = res.result.data;
				this.loadDatas();
				// var list = [];
				// this.stats.top_5_sous_traitant.forEach(element => {
				// 	list.push({
				// 		icon: 'flaticon2-line-chart tf-font-success',
				// 		title: element.raison_sociale,
				// 		desc: element.type,
				// 		url: 'entreprises/detail/' + element.id,
				// 		value: element.chiffre_affaire,
				// 		valueColor: 'tf-font-brand'
				// 	});
				// });
				// this.entrepriseSousTraitanteList = list;

				// var list = [];
				// this.stats.top_5_interim.forEach(element => {
				// 	list.push({
				// 		icon: 'flaticon2-line-chart tf-font-success',
				// 		title: element.raison_sociale,
				// 		desc: element.type,
				// 		url: 'entreprises/detail/' + element.id,
				// 		value: element.nbr_interimaires,
				// 		valueColor: 'tf-font-brand'
				// 	});
				// });
				// this.entrepriseInterimList = list;

				this.cdr.markForCheck();
			});
		} catch (error) {
			console.error(error);
    }
  }

}

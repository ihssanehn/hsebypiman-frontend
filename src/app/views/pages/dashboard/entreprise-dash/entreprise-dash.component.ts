import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '@app/core/services';
import { Widget4Data } from '@app/views/partials/content/widgets/widget4/widget4.component';

@Component({
  selector: 'tf-entreprise-dash',
  templateUrl: './entreprise-dash.component.html',
  styleUrls: ['./entreprise-dash.component.scss']
})
export class EntrepriseDashComponent implements OnInit {

  entrepriseSousTraitanteList: Widget4Data[];
  entrepriseInterimList: Widget4Data[];
  stats : any;
  filter: any = {
		keyword: ""
	};

  constructor(
    private dashboardService: DashboardService,
	protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getEntrepriseDash();
  }

  ngAfterViewInit(){}

  async getEntrepriseDash() {
		try {
			this.dashboardService.getEntrepriseStats(this.filter).subscribe(res=>{
          	this.stats = res.result.data;

			var list = [];
			this.stats.top_5_sous_traitant.forEach(element => {
				list.push({
					icon: 'flaticon2-line-chart tf-font-danger',
					title: element.raison_sociale,
					desc: element.type,
					url: 'entreprises/detail/' + element.id,
					value: element.chiffre_affaire,
					valueColor: 'tf-font-brand'
				});
			});
			this.entrepriseSousTraitanteList = list;

			var list = [];
			this.stats.top_5_interim.forEach(element => {
				list.push({
					icon: 'flaticon2-line-chart tf-font-danger',
					title: element.raison_sociale,
					desc: element.type,
					url: 'entreprises/detail/' + element.id,
					value: element.nbr_interimaires,
					valueColor: 'tf-font-brand'
				});
			});
			this.entrepriseInterimList = list;

          this.cdr.markForCheck();
				}	
			);
		} catch (error) {
			console.error(error);
    }
  }

}

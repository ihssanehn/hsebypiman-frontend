// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { DashAnalyseRisqueComponent } from './dash-analyse-risque/dash-analyse-risque.component';
import { DashChantierComponent } from './dash-chantier/dash-chantier.component';
import { DashVisiteComponent } from './dash-visite/dash-visite.component';
import { DashActionComponent } from './dash-action/dash-action.component';
import { DashEntrepriseComponent } from './dash-entreprise/dash-entreprise.component';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
	],
	providers: [],
	declarations: [
		DashboardComponent,
		DashChantierComponent,
		DashAnalyseRisqueComponent,
		DashVisiteComponent,
		DashActionComponent,
		DashEntrepriseComponent,
	]
})
export class DashboardModule {
}

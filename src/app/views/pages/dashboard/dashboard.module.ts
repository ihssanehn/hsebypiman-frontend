// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { ChantierDashComponent } from './chantier-dash/chantier-dash.component';
import { AnalyseRisqueDashComponent } from './analyse-risque-dash/analyse-risque-dash.component';
import { VisiteDashComponent } from './visite-dash/visite-dash.component';
import { ActionDashComponent } from './action-dash/action-dash.component';
import { EntrepriseDashComponent } from './entreprise-dash/entreprise-dash.component';

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
		ChantierDashComponent,
		AnalyseRisqueDashComponent,
		VisiteDashComponent,
		ActionDashComponent,
		EntrepriseDashComponent,
	]
})
export class DashboardModule {
}

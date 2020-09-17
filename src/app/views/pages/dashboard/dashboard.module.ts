// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';


// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatBadgeModule,
	MatChipsModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatListModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,MAT_DATE_LOCALE, 
	MAT_DATE_FORMATS,
	DateAdapter
} from '@angular/material';


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
		TranslateModule,

		CommonModule,
		PartialsModule,
		CoreModule,
		
		TranslateModule,
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatBadgeModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatListModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
		
		MatTableModule,

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

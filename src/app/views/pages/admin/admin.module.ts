// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { AdminComponent } from './admin.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatSlideToggleModule,
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
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
import { AdminModulesComponent } from './admin-modules/admin-modules.component';
import { AdminChantiersComponent } from './admin-chantiers/admin-chantiers.component';
import { AdminArComponent } from './admin-ar/admin-ar.component';
import { AdminActionComponent } from './admin-action/admin-action.component';
import { AdminSalariesComponent } from './admin-salaries/admin-salaries.component';
import { AdminEntrepriseComponent } from './admin-entreprise/admin-entreprise.component';
import { AdminMaterielComponent } from './admin-materiel/admin-materiel.component';
import { AdminVisitesComponent } from './admin-visites/admin-visites.component';
import { AdminVisiteChantierComponent } from './admin-visites/admin-visite-chantier/admin-visite-chantier.component';
import { AdminVisiteEpiComponent } from './admin-visites/admin-visite-epi/admin-visite-epi.component';
import { AdminVisiteVehiculeComponent } from './admin-visites/admin-visite-vehicule/admin-visite-vehicule.component';
import { AdminVisiteOutillageComponent } from './admin-visites/admin-visite-outillage/admin-visite-outillage.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{
				path: '',
				redirectTo: 'modules',
				pathMatch: 'full'
			},
			{
				path:'modules',
				component: AdminModulesComponent
			},
			{
				path:'chantiers',
				component: AdminChantiersComponent
			},
			{
				path: 'analyses-risque',
				component: AdminArComponent
			},
			{
				path:'visites-securite',
				component: AdminVisitesComponent
			},
			{
				path: 'plan-actions',
				component: AdminActionComponent
			},
			{
				path: 'salaries',
				component: AdminSalariesComponent
			},
			{
				path: 'entreprises',
				component: AdminEntrepriseComponent
			},
			{
				path:'materiel',
				component: AdminMaterielComponent,
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		NgxPermissionsModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatSlideToggleModule,
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
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
		NgbPopoverModule,
		NgxMaskModule,
	],
	providers: [
		InterceptService,
		{
        	provide: HTTP_INTERCEPTORS,
       	 	useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'tf-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		
		{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
		{ provide: DateAdapter, useClass: CustomDateAdapter },
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		// 
	],
	declarations: [
		AdminComponent,
		AdminModulesComponent,
		AdminChantiersComponent,
		AdminArComponent,
		AdminActionComponent,
		AdminSalariesComponent,
		AdminEntrepriseComponent,
		AdminMaterielComponent,
		AdminVisitesComponent,
		AdminVisiteChantierComponent,
		AdminVisiteEpiComponent,
		AdminVisiteVehiculeComponent,
		AdminVisiteOutillageComponent,
		
	]
})
export class AdminModule {
}

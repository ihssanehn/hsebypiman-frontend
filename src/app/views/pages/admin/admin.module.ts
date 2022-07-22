// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// Core Module
import {CoreModule} from '../../../core/core.module';
// Translate
import {TranslateModule} from '@ngx-translate/core';
import {PartialsModule} from '../../partials/partials.module';
import {NgxPermissionsModule} from 'ngx-permissions';
// Services
import {HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService, RefreshTokenIntercept} from '../../../core/_base/crud';
// Shared
import {ActionNotificationComponent} from '../../partials/content/crud';
// Components
import {AdminComponent} from './admin.component';
import {NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxMaskModule} from 'ngx-mask';

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
	MatTooltipModule, MAT_DATE_LOCALE,
	DateAdapter
} from '@angular/material';
import {CustomDateAdapter} from '@app/core/_base/crud/utils/custom-date.adapter';
// import { AdminUsersComponent } from './admin-users/admin-users.component';
import {AdminModulesComponent} from './admin-modules/admin-modules.component';
import {AdminChantiersComponent} from './admin-chantiers/admin-chantiers.component';
import {AdminArComponent} from './admin-ar/admin-ar.component';
import {AdminActionComponent} from './admin-action/admin-action.component';
import {AdminSalariesComponent} from './admin-salaries/admin-salaries.component';
import {AdminSuiviHseComponent} from './admin-suivi-hse/admin-suivi-hse.component';
import {AdminEntrepriseComponent} from './admin-entreprise/admin-entreprise.component';
import {AdminMaterielComponent} from './admin-materiel/admin-materiel.component';
import {AdminVisitesComponent} from './admin-visites/admin-visites.component';
import {AdminVisiteChantierComponent} from './admin-visites/admin-visite-chantier/admin-visite-chantier.component';
import {AdminVisiteEpiComponent} from './admin-visites/admin-visite-epi/admin-visite-epi.component';
import {AdminVisiteVehiculeComponent} from './admin-visites/admin-visite-vehicule/admin-visite-vehicule.component';
import {AdminVisiteOutillageComponent} from './admin-visites/admin-visite-outillage/admin-visite-outillage.component';
import {AdminPdpComponent} from './admin-pdp/admin-pdp.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{
				path: '',
				redirectTo: 'users',
				pathMatch: 'full'
			},
			{
				path: 'users',
				loadChildren: () => import('./admin-users/admin-users.module').then(m => m.AdminUsersModule),
			},
			{
				path: 'flash-infos',
				loadChildren: () => import('./admin-flashinfos/admin-flashinfos.module').then(m => m.AdminFlashInfosModule),
			},
			{
				path: 'salaries',
				component: AdminSalariesComponent
			},
			{
				path: 'chantiers',
				component: AdminChantiersComponent
			},
			{
				path: 'analyses-risque',
				component: AdminArComponent
			},
			{
				path: 'plan-de-prevention',
				component: AdminPdpComponent
			},
			{
				path: 'analyses-risque',
				component: AdminArComponent
			},
			{
				path: 'visites-securite',
				component: AdminVisitesComponent
			},
			{
				path: 'plan-actions',
				component: AdminActionComponent
			},
			{
				path: 'suivi-hse',
				component: AdminSuiviHseComponent
			},
			{
				path: 'entreprises',
				component: AdminEntrepriseComponent
			},
			{
				path: 'materiel',
				component: AdminMaterielComponent,
			},
			{
				path: 'formations',
				loadChildren: () => import('./admin-formations/admin-formations.module').then(m => m.AdminFormationsModule),
			},
			{
				path: 'habilitations',
				loadChildren: () => import('./admin-habilitations/admin-habilitations.module').then(m => m.AdminHabilitationsModule),
			},
			{
				path: 'modules',
				component: AdminModulesComponent
			},
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
		RefreshTokenIntercept,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: RefreshTokenIntercept,
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

		{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
		{provide: DateAdapter, useClass: CustomDateAdapter},
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
		// AdminUsersComponent,
		AdminModulesComponent,
		AdminChantiersComponent,
		AdminArComponent,
		AdminActionComponent,
		AdminSalariesComponent,
		AdminSuiviHseComponent,
		AdminEntrepriseComponent,
		AdminMaterielComponent,
		AdminVisitesComponent,
		AdminVisiteChantierComponent,
		AdminVisiteEpiComponent,
		AdminVisiteVehiculeComponent,
		AdminVisiteOutillageComponent,
		AdminPdpComponent,

	]
})
export class AdminModule {
}

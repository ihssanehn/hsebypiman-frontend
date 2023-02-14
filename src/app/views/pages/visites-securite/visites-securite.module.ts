// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
import { NgxPermissionsModule } from 'ngx-permissions';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService, RefreshTokenIntercept } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { VisitesSecuriteComponent } from './visites-securite.component';
import { VssDashComponent } from './visites-securite-dash/visites-securite-dash.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


// Material
import { MatInputModule,
	MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatMenuModule, MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatIconModule, MatDatepickerModule, MatExpansionModule, MatAutocompleteModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSnackBarModule, MatTooltipModule, } from '@angular/material';

const routes: Routes = [
	{
		path: '',
		component: VisitesSecuriteComponent,
		children: [
			{
				path: 'chantiers',
				loadChildren: () => import('@app/views/pages/visites-securite/chantiers/visites-chantier.module').then(m => m.VisitesChantierModule)
			},
			{
				path: 'epis',
				loadChildren: () => import('@app/views/pages/visites-securite/epis/visites-epi.module').then(m => m.VisitesEpiModule)
			},
			{
				path: 'vehicules',
				loadChildren: () => import('@app/views/pages/visites-securite/vehicules/visites-vehicule.module').then(m => m.VisitesVehiculeModule)
			},
			{
				path: 'revues',
				loadChildren: () => import('@app/views/pages/visites-securite/revues/visites-revue.module').then(m => m.VisitesRevueModule)
			},
			{
				path: 'outillages',
				loadChildren: () => import('@app/views/pages/visites-securite/outillages/visites-outillage.module').then(m => m.VisitesOutillageModule)
			},
			{
				path: 'dashboard',
				component: VssDashComponent,
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
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
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
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
		// 
	],
	declarations: [
		VisitesSecuriteComponent,
		VssDashComponent
	]
})
export class VisitesSecuriteModule {}

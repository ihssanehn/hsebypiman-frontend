// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '@app/core/core.module';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '@app/views/partials/partials.module';
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '@app/core/_base/crud';
// Shared
import { ActionNotificationComponent } from '@app/views/partials/content/crud';
// Components
import { VisitesVehiculeComponent } from './visites-vehicule.component';
import { VisitesVehiculeListComponent } from './visites-vehicule-list/visites-vehicule-list.component';
import { VisiteVehiculeEditComponent } from './visite-vehicule-edit/visite-vehicule-edit.component';
import { VisiteVehiculeAddComponent } from './visite-vehicule-add/visite-vehicule-add.component';
import { VisiteVehiculeDetailComponent } from './visite-vehicule-detail/visite-vehicule-detail.component';
import { VisiteVehiculeFiltersComponent } from './visite-vehicule-filters/visite-vehicule-filters.component';
import { VisiteVehiculeAdminComponent } from './visite-vehicule-admin/visite-vehicule-admin.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


// Material
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatMenuModule, MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatIconModule, MatDatepickerModule, MatExpansionModule, MatAutocompleteModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSnackBarModule, MatTooltipModule, } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';


const routes: Routes = [
	{
		path: '',
		component: VisitesVehiculeComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path: 'list',
				component: VisitesVehiculeListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canSeeAll']
					}
				}
			},
			{
				path: 'detail/:id',
				component: VisiteVehiculeDetailComponent
			},
			{
				path: 'add',
				component: VisiteVehiculeAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				// component: VisiteVehiculeAddComponent
				component: VisitesVehiculeComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canAdd']
					}
				}
			},
			{
				path: 'edit',
				// component: VisiteVehiculeEditComponent
				component: VisitesVehiculeComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				// component: VisiteVehiculeEditComponent
				component: VisitesVehiculeComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canUpdate']
					}
				}
			},
			{
				path: 'admin',
				component: VisiteVehiculeAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['SUPADMIN','ADMIN']
					}
				}
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
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
		// 
	],
	declarations: [
		VisitesVehiculeComponent,
		VisitesVehiculeListComponent,
		VisiteVehiculeEditComponent,
		VisiteVehiculeAddComponent,
		VisiteVehiculeFiltersComponent,
		VisiteVehiculeDetailComponent,
		VisiteVehiculeAdminComponent,
		
	]
})
export class VisitesVehiculeModule {}

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
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService, RefreshTokenIntercept} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
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
	DateAdapter
} from '@angular/material';
// DateAdapter
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
// Components
import { EntreprisesComponent } from './entreprises.component';
import { EntreprisesListComponent } from './entreprises-list/entreprises-list.component';
import { EntreprisesDashComponent } from './entreprises-dash/entreprises-dash.component';
import { EntrepriseFiltersComponent } from './entreprise-filters/entreprise-filters.component';
import { EntrepriseFormComponent } from './entreprise-form/entreprise-form.component';
import { EntrepriseEditComponent } from './entreprise-edit/entreprise-edit.component';
import { EntrepriseAddComponent } from './entreprise-add/entreprise-add.component';
import { EntrepriseDetailComponent } from './entreprise-detail/entreprise-detail.component';
import { EntrepriseAdminComponent } from './entreprise-admin/entreprise-admin.component';



const routes: Routes = [
	{
		path: '',
		component: EntreprisesComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: EntrepriseDetailComponent
			},
			{
				path: 'list',
				component: EntreprisesListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['entreprise_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: EntreprisesListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['entreprise_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: EntrepriseAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['entreprise_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: EntrepriseAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['entreprise_canAdd']
					}
				}
			},
			{
				path: 'edit',
				component: EntrepriseEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['entreprise_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: EntrepriseEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['entreprise_canUpdate']
					}
				}
			},
			{
				path: 'admin',
				component: EntrepriseAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT']
					}
				}
			},
			{
				path: 'dashboard',
				component: EntreprisesDashComponent,
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
		
		{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
		{ provide: DateAdapter, useClass: CustomDateAdapter },
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
		// 
	],
	declarations: [
		EntreprisesComponent,
		EntreprisesListComponent,
		EntreprisesDashComponent,
		EntrepriseFiltersComponent,
		EntrepriseEditComponent,
		EntrepriseAddComponent,
		EntrepriseDetailComponent,
		EntrepriseAdminComponent,
		
		EntrepriseFormComponent,
	]
})
export class EntreprisesModule {}

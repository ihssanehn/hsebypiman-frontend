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
	MAT_DATE_FORMATS,
	DateAdapter
} from '@angular/material';
// FileUpload
import { MatFileUploadModule } from 'angular-material-fileupload';

// DateAdapter
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
// Components
import { RemonteesComponent } from './remontees.component';
import { RemonteesListComponent } from './remontees-list/remontees-list.component';
import { RemonteesDashComponent } from './remontees-dash/remontees-dash.component';
import { RemonteeFiltersComponent } from './remontee-filters/remontee-filters.component';
import { RemonteeFormComponent } from './remontee-form/remontee-form.component';
import { RemonteeEditComponent } from './remontee-edit/remontee-edit.component';
import { RemonteeAddComponent } from './remontee-add/remontee-add.component';
import { RemonteeDetailComponent } from './remontee-detail/remontee-detail.component';
import { RemonteeAdminComponent } from './remontee-admin/remontee-admin.component';



const routes: Routes = [
	{
		path: '',
		component: RemonteesComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: RemonteeDetailComponent
			},
			{
				path: 'list',
				component: RemonteesListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['remontee_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: RemonteesListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['remontee_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: RemonteeAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['remontee_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: RemonteeAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['remontee_canAdd']
					}
				}
			},
			{
				path: 'edit',
				component: RemonteeEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['remontee_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: RemonteeEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['remontee_canUpdate']
					}
				}
			},
			{
				path: 'admin',
				component: RemonteeAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT']
					}
				}
			},
			{
				path: 'dashboard',
				component: RemonteesDashComponent,
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
		MatFileUploadModule,

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
		ActionNotificationComponent
		// 
	],
	declarations: [
		RemonteesComponent,
		RemonteesListComponent,
		RemonteesDashComponent,
		RemonteeFiltersComponent,
		RemonteeEditComponent,
		RemonteeAddComponent,
		RemonteeDetailComponent,
		RemonteeAdminComponent,
		RemonteeFormComponent,
	]
})
export class RemonteesModule {}

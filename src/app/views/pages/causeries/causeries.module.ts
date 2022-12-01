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
	MAT_DATE_FORMATS,
	DateAdapter
} from '@angular/material';
// DateAdapter
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
// Components
import { CauseriesComponent } from './causeries.component';
import { CauseriesListComponent } from './causeries-list/causeries-list.component';
import { CauserieFiltersComponent } from './causerie-filters/causerie-filters.component';
import { CauserieFormComponent } from './causerie-form/causerie-form.component';
import { CauserieEditComponent } from './causerie-edit/causerie-edit.component';
import { CauserieAddComponent } from './causerie-add/causerie-add.component';
import { CauserieDetailComponent } from './causerie-detail/causerie-detail.component';
import { FileUploadModule } from 'ng2-file-upload';



const routes: Routes = [
	{
		path: '',
		component: CauseriesComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: CauserieDetailComponent
			},
			{
				path: 'list',
				component: CauseriesListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['causerie_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: CauseriesListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['causerie_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: CauserieAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['causerie_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: CauserieAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['causerie_canAdd']
					}
				}
			},
			{
				path: 'edit',
				component: CauserieEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['causerie_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: CauserieEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['causerie_canUpdate']
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
		FileUploadModule
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
		CauseriesComponent,
		CauseriesListComponent,
		CauserieFiltersComponent,
		CauserieEditComponent,
		CauserieAddComponent,
		CauserieDetailComponent,		
		CauserieFormComponent,
	]
})
export class CauseriesModule {}

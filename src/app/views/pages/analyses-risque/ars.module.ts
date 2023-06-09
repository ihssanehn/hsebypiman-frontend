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
// Components
import { ArsComponent } from './ars.component';
import { ArsListComponent } from './ars-list/ars-list.component';
import { ArsDashComponent } from './ars-dash/ars-dash.component';
import { ArEditComponent } from './ar-edit/ar-edit.component';
import { ArAddComponent } from './ar-add/ar-add.component';
import { ArDetailComponent } from './ar-detail/ar-detail.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxMaskModule } from 'ngx-mask';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatChipsModule,
	MatSlideToggleModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MAT_DATE_LOCALE, 
	DateAdapter
} from '@angular/material';
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
import { ArFiltersComponent } from './ar-filters/ar-filters.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ArAdminComponent } from './ar-admin/ar-admin.component';
import { ArSignatureComponent } from './ar-signature/ar-signature.component';



const routes: Routes = [
	{
		path: '',
		component: ArsComponent,
		children: [
			{
				path: 'list',
				component: ArsListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['analyse_risque_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: ArsListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['analyse_risque_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: ArAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['analyse_risque_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: ArAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['analyse_risque_canAdd']
					}
				}
			},
			{
				path: 'edit',
				component: ArEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['analyse_risque_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: ArEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['analyse_risque_canUpdate']
					}
				}
			},
			{
				path: 'detail',
				component: ArDetailComponent
			},
			{
				path: 'dashboard',
				component: ArsDashComponent
			},
			{
				path: 'detail/:id',
				component: ArDetailComponent
			},
			{
				path: 'sign',
				component: ArSignatureComponent
			},
			{
				path: 'sign/:id',
				component: ArSignatureComponent
			},
			{
				path: 'admin',
				component: ArAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT'] 
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
		MatDialogModule,
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
		MatTooltipModule,
		MatChipsModule,
		MatSlideToggleModule,
		SignaturePadModule,
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
		ActionNotificationComponent,
	],
	declarations: [
		ArsComponent,
		ArsListComponent,
		ArsDashComponent,
		ArEditComponent,
		ArAddComponent,
		ArDetailComponent,
		ArFiltersComponent,
		ArAdminComponent,
		ArSignatureComponent,
	]
})
export class ArsModule {}

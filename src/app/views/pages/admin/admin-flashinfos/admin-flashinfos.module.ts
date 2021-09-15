// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// Core Module
import {CoreModule} from '@app/core/core.module';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
// Translate
import {TranslateModule} from '@ngx-translate/core';
import {PartialsModule} from '../../../partials/partials.module';
import {NgxPermissionsModule, NgxPermissionsGuard} from 'ngx-permissions';
// Services
import {HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '@app/core/_base/crud';
// Shared
import {ActionNotificationComponent} from '../../../partials/content/crud';
// Components
import {NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxMaskModule} from 'ngx-mask';
import {AvatarModule} from 'ngx-avatar';

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
	MatTooltipModule, MAT_DATE_LOCALE,
	MAT_DATE_FORMATS,
	MatSlideToggleModule,
	DateAdapter
} from '@angular/material';

import {AngularEditorModule} from '@kolkov/angular-editor';
import {CustomDateAdapter} from '@app/core/_base/crud/utils/custom-date.adapter';
import {AdminFlashInfosComponent} from './admin-flashinfos.component';
import {FlashInfosListComponent} from './flashinfos-list/flashinfos-list.component';
import {FlashInfoDetailComponent} from './flashinfo-detail/flashinfo-detail.component';
import {FlashInfoAddComponent} from './flashinfo-add/flashinfo-add.component';
import {FlashInfoEditComponent} from './flashinfo-edit/flashinfo-edit.component';
import {FlashInfoFormComponent} from './flashinfo-form/flashinfo-form.component';
import {FlashInfoFiltersComponent} from './flashinfo-filters/flashinfo-filters.component';


const routes: Routes = [
	{
		path: '',
		component: AdminFlashInfosComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},

			{
				path: 'list',
				component: FlashInfosListComponent,
			},
			{
				path: 'add',
				component: FlashInfoAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN', 'ROOT'],
					}
				}
			},
			{
				path: 'detail',
				component: FlashInfoDetailComponent,
			},
			{
				path: 'detail/:id',
				component: FlashInfoDetailComponent,
			},
			{
				path: 'edit/:id',
				component: FlashInfoEditComponent,
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
		AvatarModule,
		MatSlideToggleModule,
		AngularEditorModule,

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

		{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
		{provide: DateAdapter, useClass: CustomDateAdapter},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
		//
	],
	declarations: [
		AdminFlashInfosComponent,
		FlashInfosListComponent,
		FlashInfoAddComponent,
		FlashInfoFormComponent,
		FlashInfoDetailComponent,
		FlashInfoFiltersComponent,
		FlashInfoEditComponent
	]
})
export class AdminFlashInfosModule {
}

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
import { AvatarModule } from 'ngx-avatar';

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
import { 
	NzTableModule, 
	NzInputModule, 
	NzPopconfirmModule, 
	NzDividerModule, 
	NzIconModule,
	NzCheckboxModule
} from 'ng-zorro-antd';
import {DragDropModule} from '@angular/cdk/drag-drop';
// DateAdapter
import { DateMomentAdapter } from '@app/core/_base/crud/utils/date-adapter.component';
import { CustomMomentDateAdapter } from '@app/core/_base/crud/utils/custom-moment-date.adapter';
import { YEAR_FORMATS } from '@app/core/_base/crud/utils/custom-moment-date.adapter';
// Components
import { SuiviHseComponent } from './suivi-hse.component';
import { SuiviHseListComponent } from './suivi-hse-list/suivi-hse-list.component';
import { SuiviHseFiltersComponent } from './suivi-hse-filters/suivi-hse-filters.component';
import { SuiviSalarieDetailComponent } from './suivi-salarie-detail/suivi-salarie-detail.component';
import { SuiviHseGoalsComponent } from './suivi-hse-goals/suivi-hse-goals.component';
import { SuiviHseAdminComponent } from './suivi-hse-admin/suivi-hse-admin.component';
import { SuiviSalarieEditComponent } from './suivi-salarie-edit/suivi-salarie-edit.component';
import { SuiviSalarieDashComponent } from './suivi-salarie-dash/suivi-salarie-dash.component';
import { SuiviHsePeriodsAddComponent } from './suivi-hse-goals/suivi-hse-periods-add/suivi-hse-periods-add.component';


const routes: Routes = [
	{
		path: '',
		component: SuiviHseComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: SuiviSalarieDetailComponent
			},
			{
				path: 'list',
				component: SuiviHseListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['salarie_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: SuiviHseListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['salarie_canSeeAll']
					}
				}
			},
			{
				path: 'edit',
				component: SuiviSalarieEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['salarie_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: SuiviSalarieEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['salarie_canUpdate']
					}
				}
			},
			{
				path: 'admin',
				component: SuiviHseAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT']
					}
				}
			},
			{
				path: 'goal',
				component: SuiviHseGoalsComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT']
					}
				}
			},
			{
				path: 'dashboard',
				component: SuiviSalarieDashComponent
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

		NzTableModule, 
		NzInputModule, 
		NzPopconfirmModule, 
		NzDividerModule, 
		NzIconModule,
		NzCheckboxModule,
		DragDropModule
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
		{ provide: DateAdapter, useClass: DateMomentAdapter },
		// { provide: DateAdapter, useClass: CustomMomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		// { provide: MAT_DATE_FORMATS, useValue: YEAR_FORMATS },
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		SuiviHsePeriodsAddComponent
	],
	declarations: [
		SuiviHseComponent,
		SuiviHseListComponent,
		SuiviHseFiltersComponent,
		SuiviSalarieDetailComponent,
		SuiviHseGoalsComponent,
		SuiviHseAdminComponent,
		SuiviSalarieEditComponent,
		SuiviSalarieDashComponent,
		SuiviHsePeriodsAddComponent
	]
})
export class SuiviHseModule {
}

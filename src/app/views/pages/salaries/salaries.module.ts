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
import { CustomMomentDateAdapter } from '@app/core/_base/crud/utils/custom-moment-date.adapter';
import { YEAR_FORMATS } from '@app/core/_base/crud/utils/custom-moment-date.adapter';
// Components
import { SalariesComponent } from './salaries.component';
import { SalariesListComponent } from './salaries-list/salaries-list.component';
import { SalarieFiltersComponent } from './salarie-filters/salarie-filters.component';
import { SalarieDetailComponent } from './salarie-detail/salarie-detail.component';
import { SalariesGoalsComponent } from './salaries-goals/salaries-goals.component';
import { SalariesAdminComponent } from './salaries-admin/salaries-admin.component';
import { SalarieMetricsAdminComponent } from './salaries-admin/salarie-metrics-admin/salarie-metrics-admin.component';
import { SalarieAdminListPortletComponent } from './salaries-admin/salarie-admin-list-portlet/salarie-admin-list-portlet.component';
import { SalarieEditComponent } from './salarie-edit/salarie-edit.component';
import { SalarieDashComponent } from './salarie-dash/salarie-dash.component';


const routes: Routes = [
	{
		path: '',
		component: SalariesComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: SalarieDetailComponent
			},
			{
				path: 'list',
				component: SalariesListComponent
			},
			{
				path: 'list:id',
				component: SalariesListComponent
			},
			{
				path: 'add',
				component: SalariesComponent
			},
			{
				path: 'add:id',
				component: SalariesComponent
			},
			{
				path: 'edit',
				component: SalarieEditComponent
			},
			{
				path: 'edit/:id',
				component: SalarieEditComponent
			},
			{
				path: 'admin',
				component: SalariesAdminComponent
			},
			{
				path: 'goal',
				component: SalariesGoalsComponent
			},
			{
				path: 'dashboard',
				component: SalarieDashComponent
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
		{ provide: DateAdapter, useClass: CustomMomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: YEAR_FORMATS },
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
	],
	declarations: [
		SalariesComponent,
		SalariesListComponent,
		SalarieFiltersComponent,
		SalarieDetailComponent,
		SalariesGoalsComponent,
		SalariesAdminComponent,
		SalarieMetricsAdminComponent,
		SalarieAdminListPortletComponent,
		SalarieEditComponent,
		SalarieDashComponent
	]
})
export class SalariesModule {
}

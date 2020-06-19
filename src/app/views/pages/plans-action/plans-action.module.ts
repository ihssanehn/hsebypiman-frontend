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
// Components
import { PlansActionComponent } from './plans-action.component';
import { ActionsListComponent } from './actions-list/actions-list.component';
import { ActionEditComponent } from './action-edit/action-edit.component';
import { ActionAddComponent } from './action-add/action-add.component';
import { ActionDetailComponent } from './action-detail/action-detail.component';
import { ActionFiltersComponent } from './action-filters/action-filters.component';
import { ActionFormComponent } from './action-form/action-form.component';
import { ActionsDashComponent } from './actions-dash/actions-dash.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
// import { NgxEchartsModule } from 'ngx-echarts';

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
	DateAdapter,
} from '@angular/material';
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
import { ActionAdminComponent } from './action-admin/action-admin.component';
import { ActionOrigineAdminComponent } from './action-admin/action-origines-admin/action-origines-admin.component';



const routes: Routes = [
	{
		path: '',
		component: PlansActionComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: ActionDetailComponent
			},
			{
				path: 'list',
				component: ActionsListComponent
			},
			{
				path: 'list:id',
				component: ActionsListComponent
			},
			{
				path: 'add',
				component: ActionAddComponent
			},
			{
				path: 'add:id',
				component: ActionAddComponent
			},
			{
				path: 'edit',
				component: ActionEditComponent
			},
			{
				path: 'edit/:id',
				component: ActionEditComponent
			},
			{
				path: 'admin',
				component: ActionAdminComponent
			},
			{
				path: 'dashboard',
				component: ActionsDashComponent
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
		// NgxEchartsModule
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
		PlansActionComponent,
		ActionsListComponent,
		ActionEditComponent,
		ActionAddComponent,
		ActionDetailComponent,
		ActionFiltersComponent,
		ActionAdminComponent,
		ActionOrigineAdminComponent,
		ActionFormComponent,
		ActionsDashComponent
	]
})
export class PlansActionModule {}

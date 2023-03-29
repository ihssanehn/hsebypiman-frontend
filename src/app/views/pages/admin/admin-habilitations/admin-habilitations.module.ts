import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
	DateAdapter,
  MatSlideToggleModule,
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '@app/views/partials/partials.module';
import { CoreModule } from '@app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbDropdownModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { HttpUtilsService, InterceptService, LayoutUtilsService, RefreshTokenIntercept, TypesUtilsService } from '@app/core/_base/crud';
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
import { ActionNotificationComponent } from '@app/views/partials/content/crud';
import { AdminHabilitationsComponent } from './admin-habilitations.component';
import { HabilitationDetailComponent } from './habilitation-detail/habilitation-detail.component';
import { HabilitationsListComponent } from './habilitations-list/habilitations-list.component';
import { HabilitationAddComponent } from './habilitation-add/habilitation-add.component';
import { HabilitationEditComponent } from './habilitation-edit/habilitation-edit.component';
import { HabilitationFormComponent } from './habilitation-form/habilitation-form.component';
import { HabilitationFiltersComponent } from './habilitation-filters/habilitation-filters.component';


const routes: Routes = [
	{
		path: '',
		component: AdminHabilitationsComponent,
		children: [
      		{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: HabilitationDetailComponent
			},
			{
				path: 'list',
				component: HabilitationsListComponent,
			//	canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canSeeAll']
					// }
				}
			},
      		{
				path: 'list:id',
				component: HabilitationsListComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canSeeAll']
					// }
				}
			},
			{
				path: 'add',
				component: HabilitationAddComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canAdd']
					// }
				}
			},
			{
				path: 'add:id',
				component: HabilitationAddComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canAdd']
					// }
				}
			},
			{
				path: 'edit',
				component: HabilitationEditComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canUpdate']
					// }
				}
			},
			{
				path: 'edit/:id',
				component: HabilitationEditComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canUpdate']
					// }
				}
			}
    ]
  }
];


@NgModule({
	declarations: [
		AdminHabilitationsComponent,
		HabilitationsListComponent,
		HabilitationFiltersComponent,
		HabilitationAddComponent,
		HabilitationFormComponent,
		HabilitationEditComponent,
		HabilitationDetailComponent,
	],
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
    	MatSlideToggleModule
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
	]
})
export class AdminHabilitationsModule { }

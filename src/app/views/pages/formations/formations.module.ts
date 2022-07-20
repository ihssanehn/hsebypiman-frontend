import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationsComponent } from './formations.component';

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
  MatSlideToggleModule,
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '@app/views/partials/partials.module';
import { CoreModule } from '@app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { NgbDropdownModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { HttpUtilsService, InterceptService, LayoutUtilsService, RefreshTokenIntercept, TypesUtilsService } from '@app/core/_base/crud';
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
import { ActionNotificationComponent } from '@app/views/partials/content/crud';
import { FormationsListComponent } from './formations-list/formations-list.component';
import { FormationFiltersComponent } from './formation-filters/formation-filters.component';
import { FormationAddComponent } from './formation-add/formation-add.component';
import { FormationFormComponent } from './formation-form/formation-form.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { FormationDetailComponent } from './formation-detail/formation-detail.component';
import { FormationAdminComponent } from './formation-admin/formation-admin.component';


const routes: Routes = [
	{
		path: '',
		component: FormationsComponent,
		children: [
      		{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: FormationDetailComponent
			},
			{
				path: 'list',
				component: FormationsListComponent,
			//	canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canSeeAll']
					// }
				}
			},
      		{
				path: 'list:id',
				component: FormationsListComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canSeeAll']
					// }
				}
			},
			{
				path: 'add',
				component: FormationAddComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canAdd']
					// }
				}
			},
			{
				path: 'add:id',
				component: FormationAddComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canAdd']
					// }
				}
			},
			{
				path: 'edit',
				component: FormationEditComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canUpdate']
					// }
				}
			},
			{
				path: 'edit/:id',
				component: FormationEditComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					// permissions: {
					// 	only: ['action_canUpdate']
					// }
				}
			},
			{
				path: 'admin',
				component: FormationAdminComponent,
				//canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT']
					}
				}
			}
    ]
  }
];


@NgModule({
  declarations: [
    FormationsComponent,
    FormationsListComponent,
    FormationFiltersComponent,
    FormationAddComponent,
    FormationFormComponent,
    FormationEditComponent,
    FormationDetailComponent,
    FormationAdminComponent
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
export class FormationsModule { }

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
import { ChantiersComponent } from './chantiers.component';
import { ChantiersListComponent } from './chantiers-list/chantiers-list.component';
import { ChantierEditComponent } from './chantier-edit/chantier-edit.component';
import { ChantierAddComponent } from './chantier-add/chantier-add.component';
import { ChantierDetailComponent } from './chantier-detail/chantier-detail.component';
import { ChantierFiltersComponent } from './chantier-filters/chantier-filters.component';
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
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
import { ChantierAdminComponent } from './chantier-admin/chantier-admin.component';



const routes: Routes = [
	{
		path: '',
		component: ChantiersComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: ChantierDetailComponent
			},
			{
				path: 'list',
				component: ChantiersListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['chantier_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: ChantiersListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['chantier_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: ChantierAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['chantier_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: ChantierAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['chantier_canAdd']
					}
				}
			},
			{
				path: 'edit',
				component: ChantierEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['chantier_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: ChantierEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['chantier_canUpdate']
					}
				}
			},
			{
				path: 'admin',
				component: ChantierAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['SUPROOT','ROOT']
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
		ChantiersComponent,
		ChantiersListComponent,
		ChantierEditComponent,
		ChantierAddComponent,
		ChantierDetailComponent,
		ChantierFiltersComponent,
		ChantierAdminComponent,
	]
})
export class ChantiersModule {}

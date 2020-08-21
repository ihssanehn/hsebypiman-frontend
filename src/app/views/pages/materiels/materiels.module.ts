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

import {PretModalComponent} from '@app/views/partials/layout';
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
	MatSlideToggleModule,
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
// DateAdapter
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
// Components
import { MaterielsComponent } from './materiels.component';
import { MaterielsListComponent } from './materiels-list/materiels-list.component';
import { MaterielFiltersComponent } from './materiel-filters/materiel-filters.component';
import { MaterielFormComponent } from './materiel-form/materiel-form.component';
import { MaterielEditComponent } from './materiel-edit/materiel-edit.component';
import { MaterielAddComponent } from './materiel-add/materiel-add.component';
import { MaterielDetailComponent } from './materiel-detail/materiel-detail.component';
import { MaterielAdminComponent } from './materiel-admin/materiel-admin.component';


const routes: Routes = [
	{
		path: '',
		component: MaterielsComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: MaterielDetailComponent
			},
			{
				path: 'list',
				component: MaterielsListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['materiel_canSeeAll']
					}
				}
			},
			{
				path: 'list:id',
				component: MaterielsListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['materiel_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: MaterielAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['materiel_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: MaterielAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['materiel_canAdd']
					}
				}
			},
			{
				path: 'edit',
				component: MaterielEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['materiel_canUpdate']
					}
				}
			},
			{
				path: 'edit/:id',
				component: MaterielEditComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['materiel_canUpdate']
					}
				}
			},
			{
				path: 'admin',
				component: MaterielAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['SUPADMIN','ADMIN']
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
		MatSlideToggleModule,
		MatTooltipModule,
		MatDialogModule,
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
		NgbPopoverModule,
		NgxMaskModule,
		
		NzTableModule, 
		NzInputModule, 
		NzPopconfirmModule, 
		NzDividerModule, 
		NzIconModule,
		NzCheckboxModule,
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
		ActionNotificationComponent,
		PretModalComponent
		// 
	],
	declarations: [
		MaterielsComponent,
		MaterielsListComponent,
		MaterielFiltersComponent,
		MaterielEditComponent,
		MaterielAddComponent,
		MaterielDetailComponent,
		MaterielAdminComponent,
		MaterielFormComponent,
	]
})
export class MaterielsModule {}

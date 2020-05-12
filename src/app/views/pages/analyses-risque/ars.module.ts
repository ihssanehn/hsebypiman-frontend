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
import { ArsComponent } from './ars.component';
import { ArsListComponent } from './ars-list/ars-list.component';
import { ArEditComponent } from './ar-edit/ar-edit.component';
import { ArAddComponent } from './ar-add/ar-add.component';
import { ArDetailComponent } from './ar-detail/ar-detail.component';
import {NgbDropdownModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap'
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
import { ArSignaturesComponent } from './ar-signatures/ar-signatures.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ArAdminComponent } from './ar-admin/ar-admin.component';
import { ArZonesAdminComponent } from './ar-admin/ar-zones-admin/ar-zones-admin.component';
import { ArRisquesAdminComponent } from './ar-admin/ar-risques-admin/ar-risques-admin.component';
import { ArEquipementsAdminComponent } from './ar-admin/ar-equipements-admin/ar-equipements-admin.component';



const routes: Routes = [
	{
		path: '',
		component: ArsComponent,
		children: [
			{
				path: 'list',
				component: ArsListComponent
			},
			{
				path: 'list:id',
				component: ArsListComponent
			},
			{
				path: 'add',
				component: ArAddComponent
			},
			{
				path: 'add:id',
				component: ArAddComponent
			},
			{
				path: 'edit',
				component: ArEditComponent
			},
			{
				path: 'edit/:id',
				component: ArEditComponent
			},
			{
				path: 'detail',
				component: ArDetailComponent
			},
			{
				path: 'detail/:id',
				component: ArDetailComponent
			},
			{
				path: 'admin',
				component: ArAdminComponent
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
		ArEditComponent,
		ArAddComponent,
		ArDetailComponent,
		ArFiltersComponent,
		ArSignaturesComponent,
		ArAdminComponent,
		ArZonesAdminComponent,
		ArRisquesAdminComponent,
		ArEquipementsAdminComponent,
	]
})
export class ArsModule {}

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
// FileUpload
import { FileUploadModule } from 'ng2-file-upload';

// DateAdapter
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';
// Components
import { DemandesEpisComponent } from './demandes-epis.component';
import { DemandesEpisListComponent } from './demandes-epis-list/demandes-epis-list.component';
import { DemandeEpisFiltersComponent } from './demande-epis-filters/demande-epis-filters.component';
import { DemandeEpisFormComponent } from './demande-epis-form/demande-epis-form.component';
import { DemandeEpisEditComponent } from './demande-epis-edit/demande-epis-edit.component';
import { DemandeEpisAddComponent } from './demande-epis-add/demande-epis-add.component';
import { DemandeEpisDetailComponent } from './demande-epis-detail/demande-epis-detail.component';



const routes: Routes = [
	{
		path: '',
		component: DemandesEpisComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path:'detail/:id',
				component: DemandeEpisDetailComponent
			},
			{
				path: 'list',
				component: DemandesEpisListComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['demande-epis_canSeeAll']
				// 	}
				// }
			},
			{
				path: 'list:id',
				component: DemandesEpisListComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['demande-epis_canSeeAll']
				// 	}
				// }
			},
			{
				path: 'add',
				component: DemandeEpisAddComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['demande-epis_canAdd']
				// 	}
				// }
			},
			{
				path: 'add:id',
				component: DemandeEpisAddComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['demande-epis_canAdd']
				// 	}
				// }
			},
			{
				path: 'edit',
				component: DemandeEpisEditComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['demande-epis_canUpdate']
				// 	}
				// }
			},
			{
				path: 'edit/:id',
				component: DemandeEpisEditComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['demande-epis_canUpdate']
				// 	}
				// }
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
	declarations: [
		DemandesEpisComponent,
		DemandesEpisListComponent,
		DemandeEpisFiltersComponent,
		DemandeEpisEditComponent,
		DemandeEpisAddComponent,
		DemandeEpisDetailComponent,
		DemandeEpisFormComponent,
	]
})
export class DemandesEpisModule {}

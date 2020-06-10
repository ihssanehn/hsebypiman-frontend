// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '@app/core/core.module';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '@app/views/partials/partials.module';
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '@app/core/_base/crud';
// Shared
import { ActionNotificationComponent } from '@app/views/partials/content/crud';
// Components
import { VisitesOutillageComponent } from './visites-outillage.component';
import { VisitesOutillageListComponent } from './visites-outillage-list/visites-outillage-list.component';
import { VisiteOutillageEditComponent } from './visite-outillage-edit/visite-outillage-edit.component';
import { VisiteOutillageAddComponent } from './visite-outillage-add/visite-outillage-add.component';
import { VisiteOutillageDetailComponent } from './visite-outillage-detail/visite-outillage-detail.component';
import { VisiteOutillageFiltersComponent } from './visite-outillage-filters/visite-outillage-filters.component';

import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


// Material
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatMenuModule, MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatIconModule, MatDatepickerModule, MatExpansionModule, MatAutocompleteModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSnackBarModule, MatTooltipModule, } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { VisiteOutillageAdminComponent } from './visite-outillage-admin/visite-outillage-admin.component';

const routes: Routes = [
	{
		path: '',
		component: VisitesOutillageComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path: 'list',
				//component: VisitesOutillageComponent,
				component: VisitesOutillageListComponent
			},
			{
				path: 'detail/:id',
				//component: VisitesOutillageComponent
				component: VisiteOutillageDetailComponent
			},
			{
				path: 'add',
				//component: VisitesOutillageComponent
				component: VisiteOutillageAddComponent
			},
			{
				path: 'add:id',
				component: VisitesOutillageComponent
				// component: VisiteOutillageAddComponent
			},
			// {
			// 	path: 'edit',
			// 	component: VisitesOutillageComponent
			// 	// component: VisiteOutillageEditComponent
			// },
			// {
			// 	path: 'edit/:id',
			// 	//component: VisitesOutillageComponent
			// 	component: VisiteOutillageEditComponent
			// },
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
		MatTooltipModule,
		MatDialogModule,
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
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
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
		// 
	],
	declarations: [
		VisitesOutillageComponent,
		VisitesOutillageListComponent,
		VisiteOutillageEditComponent,
		VisiteOutillageAddComponent,
		VisiteOutillageDetailComponent,
		VisiteOutillageFiltersComponent,
		VisiteOutillageAdminComponent
	]
})
export class VisitesOutillageModule {}

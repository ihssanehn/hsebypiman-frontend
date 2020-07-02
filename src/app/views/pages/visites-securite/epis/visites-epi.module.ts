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
import { VisitesEpiComponent } from './visites-epi.component';
import { VisitesEpiListComponent } from './visites-epi-list/visites-epi-list.component';
import { VisiteEpiEditComponent } from './visite-epi-edit/visite-epi-edit.component';
import { VisiteEpiAddComponent } from './visite-epi-add/visite-epi-add.component';
import { VisiteEpiDetailComponent } from './visite-epi-detail/visite-epi-detail.component';
import { VisiteEpiFiltersComponent } from './visite-epi-filters/visite-epi-filters.component';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


// Material
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatMenuModule, MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatIconModule, MatDatepickerModule, MatExpansionModule, MatAutocompleteModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSnackBarModule, MatTooltipModule, } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { VisiteEpiAdminComponent } from './visite-epi-admin/visite-epi-admin.component';

const routes: Routes = [
	{
		path: '',
		component: VisitesEpiComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path: 'detail/:id',
				component: VisiteEpiDetailComponent
			},
			{
				path: 'list',
				component: VisitesEpiListComponent
			},
			{
				path: 'add',
				component: VisiteEpiAddComponent
			},
			{
				path: 'add:id',
				component: VisiteEpiAddComponent
			},
			{
				path: 'edit',
				component: VisiteEpiEditComponent
			},
			{
				path: 'edit/:id',
				component: VisiteEpiEditComponent
			},
			{
				path : 'admin',
				component : VisiteEpiAdminComponent
			}
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
		VisitesEpiComponent,
		VisitesEpiListComponent,
		VisiteEpiEditComponent,
		VisiteEpiAddComponent,
		VisiteEpiDetailComponent,
		VisiteEpiAdminComponent,
		VisiteEpiFiltersComponent
	]
})
export class VisitesEpiModule {}

// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '@app/core/core.module';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '@app/views/partials/partials.module';
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService, RefreshTokenIntercept } from '@app/core/_base/crud';
// Shared
import { ActionNotificationComponent } from '@app/views/partials/content/crud';
// Components
import { VisitesRevueComponent } from './visites-revue.component';
import { VisitesRevueListComponent } from './visites-revue-list/visites-revue-list.component';
import { VisiteRevueFiltersComponent } from './visite-revue-filters/visite-revue-filters.component';
import { VisiteRevueEditComponent } from './visite-revue-edit/visite-revue-edit.component';
import { VisiteRevueAddComponent } from './visite-revue-add/visite-revue-add.component';
import { VisiteRevueDetailComponent } from './visite-revue-detail/visite-revue-detail.component';
import { VisiteRevueAdminComponent } from './visite-revue-admin/visite-revue-admin.component';

import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';


// Material
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatMenuModule, MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatIconModule, MatDatepickerModule, MatExpansionModule, MatAutocompleteModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSnackBarModule, MatTooltipModule, } from '@angular/material';

const routes: Routes = [
	{
		path: '',
		component: VisitesRevueComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path: 'detail/:id',
				component: VisiteRevueDetailComponent
			},
			{
				path: 'list',
				component: VisitesRevueListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: VisiteRevueAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: VisiteRevueAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canAdd']
					}
				}
			},
			// {
			// 	path: 'edit',
			// 	component: VisiteRevueEditComponent
			// },
			// {
			// 	path: 'edit/:id',
			// 	component: VisiteRevueEditComponent
			// },
			{
				path: 'admin',
				component: VisiteRevueAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN','ROOT']
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
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent
		// 
	],
	declarations: [
		VisitesRevueComponent,
		VisitesRevueListComponent,
		VisiteRevueEditComponent,
		VisiteRevueAddComponent,
		VisiteRevueFiltersComponent,
		VisiteRevueDetailComponent,
		VisiteRevueAdminComponent,
		
	]
})
export class VisitesRevueModule {}

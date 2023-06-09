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
import { VisitesChantierComponent } from './visites-chantier.component';
import { VisiteChantierFiltersComponent } from './visite-chantier-filters/visite-chantier-filters.component';
import { VisitesChantierListComponent } from './visites-chantier-list/visites-chantier-list.component';
import { VisiteChantierEditComponent } from './visite-chantier-edit/visite-chantier-edit.component';
import { VisiteChantierAddComponent } from './visite-chantier-add/visite-chantier-add.component';
import { VisiteChantierDetailComponent } from './visite-chantier-detail/visite-chantier-detail.component';
import { VisiteChantierAdminComponent } from './visite-chantier-admin/visite-chantier-admin.component';

import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';


// Material
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatMenuModule, MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatNativeDateModule, MatCardModule, MatRadioModule, MatIconModule, MatDatepickerModule, MatExpansionModule, MatAutocompleteModule, MAT_DIALOG_DEFAULT_OPTIONS, MatSnackBarModule, MatTooltipModule, } from '@angular/material';

const routes: Routes = [
	{
		path: '',
		component: VisitesChantierComponent,
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path: 'detail/:id',
				component: VisiteChantierDetailComponent
			},
			{
				path: 'list',
				component: VisitesChantierListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canSeeAll']
					}
				}
			},
			{
				path: 'add',
				component: VisiteChantierAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canAdd']
					}
				}
			},
			{
				path: 'add:id',
				component: VisiteChantierAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['visite_securite_canAdd']
					}
				}
			},
			// {
			// 	path: 'edit',
			// 	component: VisiteChantierEditComponent
			// },
			// {
			// 	path: 'edit/:id',
			// 	component: VisiteChantierEditComponent
			// },
			{
				path: 'admin',
				component: VisiteChantierAdminComponent,
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
		VisitesChantierComponent,
		VisitesChantierListComponent,
		VisiteChantierEditComponent,
		VisiteChantierAddComponent,
		VisiteChantierFiltersComponent,
		VisiteChantierDetailComponent,
		VisiteChantierAdminComponent,
		
	]
})
export class VisitesChantierModule {}

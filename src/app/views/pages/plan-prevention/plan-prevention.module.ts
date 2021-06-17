import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanPreventionComponent} from './plan-prevention.component';
import {PdpListComponent} from './pdp-list/pdp-list.component';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CoreModule} from '@app/core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgbDropdownModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {SignaturePadModule} from 'angular2-signaturepad';
import {NgxMaskModule} from 'ngx-mask';
import {
	DateAdapter, MAT_DATE_LOCALE, MAT_DIALOG_DEFAULT_OPTIONS,
	MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule, MatDialogModule,
	MatExpansionModule,
	MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
	MatSelectModule,
	MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import {HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService} from '@app/core/_base/crud';
import {CustomDateAdapter} from '@app/core/_base/crud/utils/custom-date.adapter';
import {ActionNotificationComponent} from '@app/views/partials/content/crud';
import {PartialsModule} from '@app/views/partials/partials.module';

const routes: Routes = [
	{
		path: '',
		component: PlanPreventionComponent,
		children: [
			{
				path: 'list',
				component: PdpListComponent,
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['analyse_risque_canSeeAll']
				// 	}
				// }
			},
		]
	}
];

@NgModule({
	declarations: [PlanPreventionComponent, PdpListComponent],
	imports: [
		CommonModule,
		PartialsModule,
		HttpClientModule,
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
		{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
		{provide: DateAdapter, useClass: CustomDateAdapter},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
	],
})
export class PlanPreventionModule {
}

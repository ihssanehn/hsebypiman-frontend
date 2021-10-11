import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanPreventionComponent} from './plan-prevention.component';
import {PdpListComponent} from './pdp-list/pdp-list.component';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CoreModule} from '@app/core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgxPermissionsGuard, NgxPermissionsModule} from 'ngx-permissions';
import {NgbDropdownModule, NgbModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {SignaturePadModule} from 'angular2-signaturepad';
import {NgxMaskModule} from 'ngx-mask';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {
	DateAdapter, MAT_DATE_LOCALE, MAT_DIALOG_DEFAULT_OPTIONS,
	MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule, MatDialogModule,
	MatExpansionModule, MatFormFieldModule,
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
import {PdpAddComponent} from './pdp-add/pdp-add.component';
import {PdpAddFormComponent} from './pdp-add-form/pdp-add-form.component';
import {CdkColumnDef} from '@angular/cdk/table';
import {PdpAdminComponent} from './pdp-admin/pdp-admin.component';
import {NotifierModule} from 'angular-notifier';
import {PdpDetailComponent} from './pdp-detail/pdp-detail.component';
import {PdpSignatureComponent} from './pdp-signature/pdp-signature.component';
import { PdpAddClientComponent } from './pdp-add-client/pdp-add-client.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
//FileUpload
import { FileUploadModule } from 'ng2-file-upload';


const routes: Routes = [
	{
		path: '',
		component: PlanPreventionComponent,
		children: [
			{
				path: 'list',
				component: PdpListComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN', 'ROOT', 'plan_prevention_canSeeAll']
					}
				}
			},
			{
				path: 'detail/:id',
				component: PdpDetailComponent
			},
			{
				path: 'add',
				component: PdpAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN', 'ROOT', 'plan_prevention_canAdd'],
						redirectTo: '/plan-de-prevention/list'
					}
				}
			},
			{
				path: 'edit/:id',
				component: PdpAddComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN', 'ROOT', 'plan_prevention_canUpdate'],
						redirectTo: '/plan-de-prevention/list'
					}
				}
			},
			{
				path: 'admin',
				component: PdpAdminComponent,
				canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: ['ADMIN', 'ROOT'],
						redirectTo: '/plan-de-prevention/list'
					}
				}
			},
		]
	}
];

@NgModule({
	declarations: [PlanPreventionComponent, PdpListComponent, PdpAddComponent, PdpAddFormComponent, PdpAdminComponent, PdpDetailComponent, PdpSignatureComponent, PdpAddClientComponent],
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
		MatFormFieldModule,
		NzModalModule,
		NgbModule,
		NotifierModule.withConfig({
			behaviour: {
				autoHide: 3000,
			},
		}),
		NzMenuModule,
		FileUploadModule
	],
	providers: [
		CdkColumnDef,
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


// Angular
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgImageSliderModule } from 'ng-image-slider';

import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule,
	MatExpansionModule
} from '@angular/material';
// NgBootstrap
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../core/core.module';
// CRUD Partials
import {
	ActionNotificationComponent,
	AlertComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
	ContextMenu2Component,
	ContextMenuComponent,
	LanguageSelectorComponent,
	NotificationComponent,
	QuickActionComponent,
	QuickPanelComponent,
	ScrollTopComponent,
	SearchDefaultComponent,
	SearchDropdownComponent,
	SearchResultComponent,
	SplashScreenComponent,
	StickyToolbarComponent,
	Subheader1Component,
	Subheader2Component,
	Subheader3Component,
	Subheader4Component,
	Subheader5Component,
	SubheaderSearchComponent,
	UserProfile2Component,
	UserProfile3Component,
	UserProfileComponent,
	UserSideProfileComponent,
	ArFormComponent,
	SearchChantierFormComponent,
	ChantierFormComponent,
	// ChantierFiltersComponent,
	// SearchChantierHeaderComponent,
	SearchListBarComponent,
	VsFormHeadComponent,
	VsFormBodyComponent,
	VsFormSignaturesComponent,
	CommingSoonComponent,
	SignatureAddComponent,
	SignatureListComponent,
	ArDetailPanelsComponent,
	TreeSelectComponent,
	PretModalComponent,
	AddVehiculeFormComponent
} from './layout';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Errpr
import { ErrorComponent } from './content/general/error/error.component';
// Extra module
import { WidgetModule } from './content/widgets/widget.module';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';
import { PaginationComponent } from './content/general/pagination/pagination.component';
import { NgxMaskModule} from 'ngx-mask';
import { AdminListPortletComponent } from './layout/admin-list-portlet/admin-list-portlet.component';
import { 
		NzTableModule, 
		NzInputModule, 
		NzPopconfirmModule, 
		NzDividerModule, 
		NzIconModule,
		NzCheckboxModule
} from 'ng-zorro-antd';
import { AdminAddModalComponent } from './layout/admin-add-modal/admin-add-modal.component';
import { ScrollDispatchModule, ScrollingModule } from '@angular/cdk/scrolling';
import { AdminBasicListPortletComponent } from './layout/admin-basic-list-portlet/admin-basic-list-portlet.component';
import { AdminTemplateComponent } from './layout/admin-template/admin-template.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SearchOutillageFormComponent } from './layout/outillage/search-outillage-form/search-outillage-form.component';
import { SearchSalarieFormComponent } from './layout/outillage/search-salarie-form/search-salarie-form.component';
import { VisiteQuestionOutillageAdminComponent } from './layout/outillage/visite-question-outillage-admin/visite-question-outillage-admin.component';
import { VsVehiculeFormImgComponent } from './layout/visites/form/vs-vehicule/vs-vehicule-form-img/vs-vehicule-form-img.component';
import { SearchEpiFormComponent } from './layout/epi/search-epi-form/search-epi-form.component';
import { VsVehiculeImageCarouselComponent } from './layout/visites/form/vs-vehicule/vs-vehicule-image-carousel/vs-vehicule-image-carousel.component';
import { ImageLightboxContentDialogComponent } from './layout/modal/image-lightbox-content-dialog/image-lightbox-content-dialog.component';

@NgModule({
	declarations: [
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		UserProfile2Component,
		UserProfile3Component,
		UserSideProfileComponent,
		ChantierFormComponent,
		// ChantierFiltersComponent,
		// SearchChantierHeaderComponent,
		VsFormHeadComponent,
		VsFormBodyComponent,
		VsFormSignaturesComponent,
		SearchListBarComponent,

		CartComponent,
		
		ErrorComponent,
		PaginationComponent,
		CommingSoonComponent,
		ArFormComponent,
		SearchChantierFormComponent,
		AdminListPortletComponent,
		AdminBasicListPortletComponent,
		AdminAddModalComponent,
		AdminTemplateComponent,
		SignatureAddComponent,
		SignatureListComponent,
		ArDetailPanelsComponent,
		TreeSelectComponent,

		PretModalComponent,
		SearchOutillageFormComponent,

		SearchSalarieFormComponent,
		VisiteQuestionOutillageAdminComponent,
		AddVehiculeFormComponent,
		VsVehiculeFormImgComponent,
		SearchEpiFormComponent,
		VsVehiculeImageCarouselComponent,
		ImageLightboxContentDialogComponent
	],
	exports: [
		WidgetModule,
		PortletModule,
		NgSelectModule,

		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		UserProfile2Component,
		UserProfile3Component,
		UserSideProfileComponent,
		ArFormComponent,
		SearchChantierFormComponent,
		ChantierFormComponent,
		VsFormHeadComponent,
		VsFormBodyComponent,
		VsFormSignaturesComponent,
		SearchListBarComponent,
		CartComponent,
		
		ErrorComponent,
		PaginationComponent,
		CommingSoonComponent,

		AdminListPortletComponent,
		AdminBasicListPortletComponent,
		NgbModule,
		AdminTemplateComponent,
		SignatureAddComponent,
		SignatureListComponent,
		ArDetailPanelsComponent,
		TreeSelectComponent,

		PretModalComponent,
		SearchOutillageFormComponent,
		SearchSalarieFormComponent,
		VisiteQuestionOutillageAdminComponent,
		AddVehiculeFormComponent,
		VsVehiculeFormImgComponent,
		SearchEpiFormComponent,
		VsVehiculeImageCarouselComponent,
		ImageLightboxContentDialogComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
		WidgetModule,
		NgSelectModule,
		TranslateModule,
		// angular material modules
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
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
		MatInputModule,

		SignaturePadModule,
		NgImageSliderModule,

		// ng-bootstrap modules
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
		NgxMaskModule,
		MatSlideToggleModule,
		MatChipsModule,
		NgbModalModule,

		NzTableModule,
		NzInputModule,
		NzPopconfirmModule,
		NzDividerModule,
		NzIconModule,
		NzCheckboxModule,
		NgbModule,
		DragDropModule,
		
		MatExpansionModule


	],
	entryComponents: [
		AdminAddModalComponent,
		PretModalComponent,
	],
})
export class PartialsModule {
}

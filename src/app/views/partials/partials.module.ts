// Angular
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgImageSliderModule } from 'ng-image-slider';
import { AvatarModule } from 'ngx-avatar';
import { NgxPermissionsModule } from 'ngx-permissions';
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
import { FileUploadModule } from 'ng2-file-upload';
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
	AddVehiculeFormComponent,
	SalarieScoreComponent,
	HabilitationsAdminComponent,
	ArZonesAdminComponent,
	ArRisquesAdminComponent,
	ArEquipementsAdminComponent,
	ActionOriginesAdminComponent,
	SalarieMetricsAdminComponent,
	SalarieAdminListPortletComponent,
	EntrepriseTypesAdminComponent,
	RemonteeTypesAdminComponent,
	MaterielEtatsAdminComponent,
	MaterielTypesAdminComponent,
	MaterielTypesAdminPortletComponent,
	VisiteQuestionsVehiculeAdminComponent,
	VisiteQuestionsOutillageAdminComponent,
	VisiteQuestionsEpiAdminComponent,
	VisiteQuestionsChantierAdminComponent,
	SalarieFonctionsAdminComponent

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
import { SearchMaterielFormComponent } from './layout/visites/form/search-materiel-form/search-materiel-form.component';
import { VisiteQuestionOutillageAdminComponent } from './layout/outillage/visite-question-outillage-admin/visite-question-outillage-admin.component';
import { VsVehiculeFormImgComponent } from './layout/visites/form/vs-vehicule/vs-vehicule-form-img/vs-vehicule-form-img.component';
import { SearchEpiFormComponent } from './layout/epi/search-epi-form/search-epi-form.component';
import { VsVehiculeImageCarouselComponent } from './layout/visites/form/vs-vehicule/vs-vehicule-image-carousel/vs-vehicule-image-carousel.component';
import { ImageLightboxContentDialogComponent } from './layout/modal/image-lightbox-content-dialog/image-lightbox-content-dialog.component';
import { ShowDocumentModalComponent } from './layout/modal/show-document-modal/show-document-modal.component';

import { SalariePortletComponent } from './layout/salarie/salarie-portlet/salarie-portlet.component';
import { SalariePortletBoxComponent } from './layout/salarie/salarie-portlet-box/salarie-portlet-box.component';
import { SalariePortletRowComponent } from './layout/salarie/salarie-portlet-row/salarie-portlet-row.component';
import { SalarieCardComponent } from './layout/salarie/salarie-card/salarie-card.component';
import { SalarieSuiviComponent } from './layout/salarie/salarie-suivi/salarie-suivi.component';
import { CommentsListComponent } from './layout/comments/comments-list/comments-list.component';
import { CommentsAddComponent } from './layout/comments/comments-add/comments-add.component';
import { LastRemonteesComponent } from './layout/remontees/last-remontees/last-remontees.component';
import { FlashInfosTopComponent } from './layout/flash-infos/flash-infos-top/flash-infos-top.component';

import { DashAnalyseRisqueComponent } from './layout/dashboard/dash-analyse-risque/dash-analyse-risque.component';
import { DashChantierComponent } from './layout/dashboard/dash-chantier/dash-chantier.component';
import { DashVisiteComponent } from './layout/dashboard/dash-visite/dash-visite.component';
import { DashActionComponent } from './layout/dashboard/dash-action/dash-action.component';
import { DashMaterielComponent } from './layout/dashboard/dash-materiel/dash-materiel.component';
import { DashEntrepriseComponent } from './layout/dashboard/dash-entreprise/dash-entreprise.component';
import { ShowFlashInfoModalComponent } from './layout/flash-infos/show-flash-info-modal/show-flash-info-modal.component';
import { AddDocModalComponent } from './layout/modal/add-doc-modal/add-doc-modal.component';

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

		SearchMaterielFormComponent,
		VisiteQuestionOutillageAdminComponent,
		AddVehiculeFormComponent,
		VsVehiculeFormImgComponent,
		SearchEpiFormComponent,
		VsVehiculeImageCarouselComponent,
		ImageLightboxContentDialogComponent,
		ShowFlashInfoModalComponent,
		AddDocModalComponent,
		ShowDocumentModalComponent,
		SalarieScoreComponent,
		SalariePortletComponent,
		SalariePortletBoxComponent,
		SalariePortletRowComponent,
		SalarieCardComponent,
		SalarieSuiviComponent,
		HabilitationsAdminComponent,
		ArZonesAdminComponent,
		ArRisquesAdminComponent,
		ArEquipementsAdminComponent,
		ActionOriginesAdminComponent,
		SalarieMetricsAdminComponent,
		SalarieAdminListPortletComponent,
		EntrepriseTypesAdminComponent,
		RemonteeTypesAdminComponent,
		MaterielEtatsAdminComponent,
		MaterielTypesAdminComponent,
		MaterielTypesAdminPortletComponent,
		VisiteQuestionsVehiculeAdminComponent,
		VisiteQuestionsOutillageAdminComponent,
		VisiteQuestionsEpiAdminComponent,
		SalarieFonctionsAdminComponent,
		VisiteQuestionsChantierAdminComponent,
		CommentsListComponent,
		CommentsAddComponent,
		LastRemonteesComponent,
		FlashInfosTopComponent,
		DashAnalyseRisqueComponent,
		DashChantierComponent,
		DashVisiteComponent,
		DashActionComponent,
		DashMaterielComponent,
		DashEntrepriseComponent,

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
		SearchMaterielFormComponent,
		VisiteQuestionOutillageAdminComponent,
		AddVehiculeFormComponent,
		VsVehiculeFormImgComponent,
		SearchEpiFormComponent,
		VsVehiculeImageCarouselComponent,
		ImageLightboxContentDialogComponent,
		ShowFlashInfoModalComponent,
		AddDocModalComponent,
		ShowDocumentModalComponent,
		SalarieScoreComponent,
		SalariePortletComponent,
		SalariePortletBoxComponent,
		SalariePortletRowComponent,
		SalarieCardComponent,
		SalarieSuiviComponent,
		HabilitationsAdminComponent,
		ArZonesAdminComponent,
		ArRisquesAdminComponent,
		ArEquipementsAdminComponent,
		ActionOriginesAdminComponent,
		SalarieMetricsAdminComponent,
		SalarieAdminListPortletComponent,
		EntrepriseTypesAdminComponent,
		RemonteeTypesAdminComponent,
		MaterielEtatsAdminComponent,
		MaterielTypesAdminComponent,
		MaterielTypesAdminPortletComponent,
		VisiteQuestionsVehiculeAdminComponent,
		VisiteQuestionsOutillageAdminComponent,
		VisiteQuestionsEpiAdminComponent,
		SalarieFonctionsAdminComponent,
		VisiteQuestionsChantierAdminComponent,
		CommentsListComponent,
		CommentsAddComponent,
		LastRemonteesComponent,
		FlashInfosTopComponent,
		DashAnalyseRisqueComponent,
		DashChantierComponent,
		DashVisiteComponent,
		DashActionComponent,
		DashMaterielComponent,
		DashEntrepriseComponent,

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
		AvatarModule,

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
		MatExpansionModule,
		FileUploadModule,
		NgxPermissionsModule.forChild(),
	],
	entryComponents: [
		AdminAddModalComponent,
		PretModalComponent,
		ShowFlashInfoModalComponent,
		AddDocModalComponent
	],
})
export class PartialsModule {
}

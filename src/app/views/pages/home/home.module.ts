// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';


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
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';


import { HomeComponent } from './home.component';
import {NgxPermissionsModule} from "ngx-permissions";

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		TranslateModule,

		CommonModule,
		PartialsModule,
		CoreModule,

		TranslateModule,
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

		MatTableModule,
		NgxPermissionsModule.forChild(),
		RouterModule.forChild([
			{
				path: '',
				component: HomeComponent
			},
		]),
	],
	providers: [],
	declarations: [
		HomeComponent,
	]
})
export class HomeModule {
}

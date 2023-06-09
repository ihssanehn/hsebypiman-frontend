import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSelectModule, MatInputModule, MatChipsModule, MatAutocompleteModule, } from '@angular/material';
import { CoreModule } from '../../../../core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Datatable
import { DataTableComponent } from './general/data-table/data-table.component';
// General widgets
import { Widget1Component } from './widget1/widget1.component';
import { Widget2Component } from './widget2/widget2.component';
import { Widget4Component } from './widget4/widget4.component';
import { Widget5Component } from './widget5/widget5.component';
import { Widget12Component } from './widget12/widget12.component';
import { Widget14Component } from './widget14/widget14.component';
import { Widget26Component } from './widget26/widget26.component';
import { WidgetIndicatorComponent } from './widget-indicator/widget-indicator.component';
import { WidgetIndicatorListComponent } from './widget-indicator-list/widget-indicator-list.component';
import { Timeline2Component } from './timeline2/timeline2.component';
import { PortletModule } from '../general/portlet/portlet.module';
import { SelectAutocompleteComponent } from './inputs/select-autocomplete/select-autocomplete.component';
import { MultiSelectAutocompleteComponent } from './inputs/multi-select-autocomplete/multi-select-autocomplete.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		DataTableComponent,
		// Widgets
		Widget1Component,
		Widget2Component,
		Widget4Component,
		Widget5Component,
		Widget12Component,
		Widget14Component,
		Widget26Component,
		WidgetIndicatorComponent,
		WidgetIndicatorListComponent,
		Timeline2Component,
		SelectAutocompleteComponent,
		MultiSelectAutocompleteComponent
	],
	exports: [
		DataTableComponent,
		// Widgets
		Widget1Component,
		Widget2Component,
		Widget4Component,
		Widget5Component,
		Widget12Component,
		Widget14Component,
		Widget26Component,
		WidgetIndicatorComponent,
		WidgetIndicatorListComponent,
		Timeline2Component,
		SelectAutocompleteComponent,
		MultiSelectAutocompleteComponent
	],
	imports: [
		CommonModule,
		PerfectScrollbarModule,
		MatTableModule,
		CoreModule,
		MatIconModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSortModule,
		PortletModule,
		MatSelectModule,
		MatInputModule,
		MatChipsModule,
		MatAutocompleteModule,
		TranslateModule,
		ReactiveFormsModule,
		FormsModule,
	]
})
export class WidgetModule {
}

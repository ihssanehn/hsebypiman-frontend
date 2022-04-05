// Anglar
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@env/environment';
import { HttpParameterService } from './services/setting/http-parameter.service';
// Layout Directives
// Services
import {
	ContentAnimateDirective,
	FirstLetterPipe,
	GetObjectPipe,
	HeaderDirective,
	NgSelectFormFieldControlDirective,
	RecursiveSearchPipe,
	JoinPipe,
	CustomPercentPipe,
	MenuDirective,
	MatInputAmountDirective,
	OffcanvasDirective,
	SafePipe,
	TruncatePipe,
	DateEnToFrPipe,
	DateFrToEnPipe,
	ScrollTopDirective,
	IfAllModulesDirective,
	IfInModulesDirective,
	SparklineChartDirective,
	StickyDirective,
	TabClickEventDirective,
	TimeElapsedPipe,
	DateTimeMessagePipe,
	DateMessagePipe,
	FullNamePipe,
	InitialesPipe,
	ToggleDirective,
	MaskDirective
} from './_base/layout';
import {PdpFilterItemsPipe} from "@app/core/_base/layout/pipes/pdp-filter-items.pipe";
import {addLinePipe} from "@app/core/_base/layout/pipes/addline.pipe";


@NgModule({
	imports: [CommonModule],
	declarations: [
		// directives
		ScrollTopDirective,
		IfAllModulesDirective,
		IfInModulesDirective,
		HeaderDirective,
		OffcanvasDirective,
		ToggleDirective,
		MenuDirective,
		MatInputAmountDirective,
		TabClickEventDirective,
		SparklineChartDirective,
		ContentAnimateDirective,
		NgSelectFormFieldControlDirective,
		StickyDirective,
		MaskDirective,
		// pipes
		TimeElapsedPipe,
		DateTimeMessagePipe,
		DateMessagePipe,
		RecursiveSearchPipe,
		JoinPipe,
		GetObjectPipe,
		PdpFilterItemsPipe,
		SafePipe,
		TruncatePipe,
		FirstLetterPipe,
		InitialesPipe,
		FullNamePipe,
		CustomPercentPipe,
		addLinePipe,
		DateEnToFrPipe,
		DateFrToEnPipe
	],
	exports: [
		// directives
		ScrollTopDirective,
		HeaderDirective,
		OffcanvasDirective,
		IfAllModulesDirective,
		IfInModulesDirective,
		ToggleDirective,
		PdpFilterItemsPipe,
		MenuDirective,
		MatInputAmountDirective,
		TabClickEventDirective,
		SparklineChartDirective,
		ContentAnimateDirective,
		NgSelectFormFieldControlDirective,
		StickyDirective,
		MaskDirective,
		// pipes
		TimeElapsedPipe,
		DateTimeMessagePipe,
		DateMessagePipe,
		JoinPipe,
		GetObjectPipe,
		SafePipe,
		TruncatePipe,
		FirstLetterPipe,
		FullNamePipe,
		InitialesPipe,
		CustomPercentPipe,
		addLinePipe,
		DateEnToFrPipe,
		DateFrToEnPipe,
		RecursiveSearchPipe,
	],
	providers: [
		{provide: 'ParameterService', useClass: environment.isMockEnabled ? HttpParameterService : HttpParameterService},
		DateEnToFrPipe,
		DateFrToEnPipe,
		SafePipe,
		RecursiveSearchPipe,
	]
})
export class CoreModule {
}

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
	SparklineChartDirective,
	StickyDirective,
	TabClickEventDirective,
	TimeElapsedPipe,
	DateTimeMessagePipe, 
	DateMessagePipe,
	FullNamePipe,
	InitialesPipe,
	ToggleDirective
} from './_base/layout';

@NgModule({
	imports: [CommonModule],
	declarations: [
		// directives
		ScrollTopDirective,
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
		// pipes
		TimeElapsedPipe,
		DateTimeMessagePipe, 
		DateMessagePipe,
		JoinPipe,
		GetObjectPipe,
		SafePipe,
		TruncatePipe,
		FirstLetterPipe,
		InitialesPipe,
		FullNamePipe,
		CustomPercentPipe,
		DateEnToFrPipe, 
		DateFrToEnPipe
	],
	exports: [
		// directives
		ScrollTopDirective,
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
		DateEnToFrPipe, 
		DateFrToEnPipe,
	],
	providers: [
		{provide: 'ParameterService', useClass: environment.isMockEnabled ? HttpParameterService : HttpParameterService},
		DateEnToFrPipe, 
		DateFrToEnPipe,
	]
})
export class CoreModule {
}

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
	MenuDirective,
	OffcanvasDirective,
	SafePipe,
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
		FirstLetterPipe,
		InitialesPipe,
		FullNamePipe
	],
	exports: [
		// directives
		ScrollTopDirective,
		HeaderDirective,
		OffcanvasDirective,
		ToggleDirective,
		MenuDirective,
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
		FirstLetterPipe,
		FullNamePipe,
		InitialesPipe,
	],
	providers: [
		 {provide: 'ParameterService', useClass: environment.isMockEnabled ? HttpParameterService : HttpParameterService}
	]
})
export class CoreModule {
}

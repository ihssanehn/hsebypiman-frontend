// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule, LOCALE_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule} from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms'
import { GestureConfig, MatProgressSpinnerModule,MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { CustomDateAdapter } from '@app/core/_base/crud/utils/custom-date.adapter';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { OverlayModule } from '@angular/cdk/overlay';
// Angular in memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Env
import { environment } from '../environments/environment';
// Hammer JS
import 'hammerjs';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// State
import { metaReducers, reducers } from './core/reducers';
// Copmponents
import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './views/theme/theme.module';
import { SignaturePadModule } from 'angular2-signaturepad';
// Partials 
import { PartialsModule } from './views/partials/partials.module';
import { NgSelectModule } from '@ng-select/ng-select';
// Layout Services
// FakeApiService
import {DataTableService,TfDialogService,LayoutConfigService,VersionCheckService,LayoutRefService,MenuAsideService,MenuConfigService,MenuHorizontalService,PageConfigService,SplashScreenService,SubheaderService} from './core/_base/layout';
// Auth
import { AuthModule } from './views/pages/auth/auth.module';
import { AuthService } from './core/auth';
import { 
	ChantierService, TypeService, StatusService, ActionService, CategorieService, ArService, CatRisqueService, EquipementService,
	EntrepriseService, VisiteEpiService, VisiteChantierService, CatHabilitationService, CatQuestionService, ZoneService, SignatureService, QuestionService,
	HabilitationService, RisqueService, ParamsService, EpiService, VisiteOutillageService, VisiteVehiculeService, OutillageService, UserService
} from './core/services';
// CRUD
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/layout.config';

// Echart
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
// Highlight JS
import { HIGHLIGHT_OPTIONS, HighlightLanguage } from 'ngx-highlightjs';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as xml from 'highlight.js/lib/languages/xml';
import * as json from 'highlight.js/lib/languages/json';

import { NZ_I18N,en_US } from 'ng-zorro-antd';


// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
};

const MY_FORMAT = {
	// parse: {
	// 	dateInput: 'DD/MM/YYYY',
	// },
	// display: {
	// 	dateInput: 'DD/MM/YYYY',
	// 	monthYearLabel: 'MMM YYYY',
	// 	dateA11yLabel: 'DD/MM/YYYY',
	// 	monthYearA11yLabel: 'MMMM YYYY',
	// },
	parse: {
		dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
	},
	display: {
		// dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
		dateInput: 'input',
		monthYearLabel: {year: 'numeric', month: 'short'},
		dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
		monthYearA11yLabel: {year: 'numeric', month: 'long'},
	}
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}

export function hljsLanguages(): HighlightLanguage[] {
	return [
		{name: 'typescript', func: typescript},
		{name: 'scss', func: scss},
		{name: 'xml', func: xml},
		{name: 'json', func: json}
	];
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		// environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
		// 	passThruUnknownUrl: true,
		// 	dataEncapsulation: false
		// }) : [],
		NgxPermissionsModule.forRoot(),
		PartialsModule,
		CoreModule,
		OverlayModule,
		StoreModule.forRoot(reducers, {metaReducers}),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
		StoreDevtoolsModule.instrument(),
		AuthModule.forRoot(),
		TranslateModule.forRoot(),
		MatProgressSpinnerModule,
		InlineSVGModule.forRoot(),
		ThemeModule,
		NgxMaskModule.forRoot({
			decimalMarker: '.',
		}),
		ReactiveFormsModule,
		SignaturePadModule,
		NgxEchartsModule.forRoot({
			echarts
		})
	],
	exports: [],
	providers: [
		{
			provide: LOCALE_ID,
			useValue: 'fr-FR'
		},

		// WORK
		AuthService,
		ArService,
		ActionService,
		CategorieService,
		CatHabilitationService, 
		CatQuestionService,
		CatRisqueService,
		ChantierService,
		EquipementService,
		EntrepriseService,
		EpiService,
		HabilitationService,
		OutillageService,
		ParamsService,
		QuestionService,
		RisqueService,
		SignatureService,
		StatusService, 
		TypeService, 
		UserService,
		VisiteChantierService,
		VisiteEpiService,
		VisiteOutillageService,
		VisiteVehiculeService,
		OutillageService,
		ZoneService,
		

		// CONFIG & Helpers
		LayoutConfigService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		TfDialogService,
		DataTableService,
		VersionCheckService,
		SplashScreenService,
		
		// template services
		SubheaderService,
		MenuHorizontalService,
		MenuAsideService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: GestureConfig
		},
		{
			// layout config initializer
			provide: APP_INITIALIZER,
			useFactory: initializeLayoutConfig,
			deps: [LayoutConfigService], multi: true
		},
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {languages: hljsLanguages}
		},
		{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
		{ provide: DateAdapter, useClass: CustomDateAdapter },
		{ provide: NZ_I18N, useValue: en_US }

	],
	bootstrap: [AppComponent],
})
export class AppModule {
}

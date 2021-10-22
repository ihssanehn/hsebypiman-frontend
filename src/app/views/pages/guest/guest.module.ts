// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components

// Auth
import { AuthGuard, AuthService } from '../../../core/auth';
import { GuestComponent } from './guest.component';
import { PdpValidationComponent } from './pdp-validation/pdp-validation.component';
import { PlanPreventionModule } from '../plan-prevention/plan-prevention.module';

const routes: Routes = [
	{
		path: '',
		component: GuestComponent,
		children: [
			{
				path: 'pdp-validation/:itemid/:token',
				component: PdpValidationComponent,
			},
			{
				path: '',
				redirectTo: '',
				pathMatch: 'full'
			},
		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatCheckboxModule,
		PlanPreventionModule,
		TranslateModule.forChild(),
	],
	providers: [
		// InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: InterceptService,
		// 	multi: true
		// },
	],
	exports: [
		GuestComponent, 
	],
	declarations: [
		GuestComponent,
		PdpValidationComponent,
	]
})

export class GuestModule {}

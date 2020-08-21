// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ModuleGuard } from './core/guards/module.guard';

const routes: Routes = [
	{path: 'auth', loadChildren: () => import('@app/views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		// canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('@app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
			},
			{
				path: 'chantiers',
				loadChildren: () => import('@app/views/pages/chantiers/chantiers.module').then(m => m.ChantiersModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes: ['CHANTIER'],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			{
				path: 'analyses-risque',
				loadChildren: () => import('@app/views/pages/analyses-risque/ars.module').then(m => m.ArsModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['ANALYSE'],
					permissions: {
						only: ['SUPADMIN','USER']
					}
				}
			},
			{
				path: 'visites-securite',
				loadChildren: () => import('@app/views/pages/visites-securite/visites-securite.module').then(m => m.VisitesSecuriteModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['VISITE'],
					permissions: {
						only: ['SUPADMIN','USER']
					}
				}
			},
			{
				path: 'plan-actions',
				loadChildren: () => import('@app/views/pages/plans-action/plans-action.module').then(m => m.PlansActionModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['PLANACTION'],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			{
				path: 'salaries',
				loadChildren: () => import('@app/views/pages/salaries/salaries.module').then(m => m.SalariesModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['SALARIE'],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			{
				path: 'materiel',
				loadChildren: () => import('@app/views/pages/materiels/materiels.module').then(m => m.MaterielsModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['MATERIEL'],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			{
				path: 'entreprises',
				loadChildren: () => import('@app/views/pages/entreprises/entreprises.module').then(m => m.EntreprisesModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['ENTREPRISE'],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			{
				path: 'admin',
				loadChildren: () => import('@app/views/pages/admin/admin.module').then(m => m.AdminModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['PARAMS'],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			{
				path: 'mail',
				loadChildren: () => import('@app/views/pages/apps/mail/mail.module').then(m => m.MailModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:[],
					permissions: {
						only: 'SUPADMIN'
					}
				}
			},
			// {
			// 	path: 'user-management',
			// 	loadChildren: () => import('@app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			// },
			{
				path: 'builder',
				loadChildren: () => import('@app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}

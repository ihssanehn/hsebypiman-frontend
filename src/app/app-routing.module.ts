// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ModuleGuard } from './core/guards/module.guard';
import { AuthGuard } from './core/auth';


const routes: Routes = [
	{
		path: 'auth', 
		loadChildren: () => import('@app/views/pages/auth/auth.module').then(m => m.AuthModule)
	},
	// {
	// 	path: 'livret-accueil', 
	// 	loadChildren: () => import('@app/views/pages/livret-accueil/livret-accueil.module').then(m => m.LivretAccueilModule)
	// },
	{
		path: 'quizz', 
		loadChildren: () => import('@app/views/pages/quizz/quizz.module').then(m => m.QuizzModule)
	},
	{
		path: 'guest',
		loadChildren: () => import('@app/views/pages/guest/guest.module').then(m => m.GuestModule),
	},
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'home',
				loadChildren: () => import('@app/views/pages/home/home.module').then(m => m.HomeModule),
			},
			{
				path: 'remontees',
				loadChildren: () => import('@app/views/pages/remontees/remontees.module').then(m => m.RemonteesModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes: ['REMONTEE']
				}
			},
			{
				path: 'chantiers',
				loadChildren: () => import('@app/views/pages/chantiers/chantiers.module').then(m => m.ChantiersModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes: ['CHANTIER']
				}
			},
			{
				path: 'analyses-risque',
				loadChildren: () => import('@app/views/pages/analyses-risque/ars.module').then(m => m.ArsModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['ANALYSE']
				}
			},
			{
				path: 'plan-de-prevention',
				loadChildren: () => import('@app/views/pages/plan-prevention/plan-prevention.module').then(m => m.PlanPreventionModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['ANALYSE']
				}
			},
			{
				path: 'visites-securite',
				loadChildren: () => import('@app/views/pages/visites-securite/visites-securite.module').then(m => m.VisitesSecuriteModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['VISITE']
				}
			},
			{
				path: 'plan-actions',
				loadChildren: () => import('@app/views/pages/plans-action/plans-action.module').then(m => m.PlansActionModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['PLANACTION']
				}
			},
			{
				path: 'suivi-hse',
				loadChildren: () => import('@app/views/pages/suivi-hse/suivi-hse.module').then(m => m.SuiviHseModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['SALARIE']
				}
			},
			{
				path: 'materiel',
				loadChildren: () => import('@app/views/pages/materiels/materiels.module').then(m => m.MaterielsModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['MATERIEL']
				}
			},
			{
				path: 'entreprises',
				loadChildren: () => import('@app/views/pages/entreprises/entreprises.module').then(m => m.EntreprisesModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['ENTREPRISE']
				}
			},
			{
				path: 'causeries',
				loadChildren: () => import('@app/views/pages/causeries/causeries.module').then(m => m.CauseriesModule),
				// canActivate: [ModuleGuard],
				// data: {
				// 	moduleCodes:['CAUSERIE']
				// }
			},
			{
				path: 'discuss',
				loadChildren: () => import('@app/views/pages/discuss/discuss.module').then(m => m.DiscussModule),
				canActivate: [ModuleGuard],
				data: {
					moduleCodes:['DISCUSS']
				}
			},
			{
				path: 'profile',
				loadChildren: () => import('@app/views/pages/profile/profile.module').then(m => m.ProfileModule),

			},
			{
				path: 'admin',
				loadChildren: () => import('@app/views/pages/admin/admin.module').then(m => m.AdminModule),
				canActivate: [ModuleGuard, NgxPermissionsGuard],
				data: {
					moduleCodes:['PARAMS'],
					permissions: {
						only: ['ROOT', 'ADMIN']
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
						only: 'ADMIN'
					}
				}
			},
			// {
			// 	path: 'formations',
			// 	loadChildren: () => import('@app/views/pages/formations/formations.module').then(m => m.FormationsModule),
			// 	canActivate: [ModuleGuard, NgxPermissionsGuard],
			// 	data: {
			// 		moduleCodes:['FORMATIONS'],
			// 		permissions: {
			// 			only: ['ROOT', 'ADMIN']
			// 		}
			// 	}
			// },
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
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{path: '**', redirectTo: 'home', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}

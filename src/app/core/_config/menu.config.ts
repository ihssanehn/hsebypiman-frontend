export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [

				{
					title: 'Accueil',
					root: true,
					alignment: 'left',
					page: '/home',
					translate: 'MENU.HOME',
					needModule: false,
				},
				// {
				// 	title: 'Dashboards',
				// 	root: true,
				// 	alignment: 'left',
				// 	page: '/dashboard',
				// 	translate: 'MENU.DASHBOARD',
				// 	needModule: false,
				// 	permissionOnly: ['ROOT', 'ADMIN'],
				// },
				{
					title: 'Remontées QHSE',
					root: true,
					alignment: 'left',
					page: '/remontees/list',
					translate: 'MENU.REMONTEES',
					needModule: true,
					moduleCode: ['REMONTEE']
				},
				{
					title: 'Chantiers',
					root: true,
					alignment: 'left',
					page: '/chantiers/list',
					translate: 'MENU.CHANTIER',
					needModule: true,
					moduleCode: ['CHANTIER']
				},
				{
					title: 'Analyses de risque',
					root: true,
					alignment: 'left',
					page: '/analyses-risque/list',
					translate: 'MENU.ANALYSERISQUE',
					needModule: true,
					moduleCode: ['ANALYSE'],
				},
				{
					title: 'Plan de prévention',
					root: true,
					alignment: 'left',
					page: '/plan-de-prevention/list',
					translate: 'MENU.PLANDEPREVENTION',
					needModule: true,
					moduleCode: ['PLAN_DE_PREVENTION'],
				},
				{
					title: 'Visites sécurité',
					root: true,
					alignment: 'left',
					page: '/visites-securite/chantiers/list',
					translate: 'MENU.VISITESECURITE',
					needModule: true,
					moduleCode: ['VISITE'],
					children: true,
				},
				{
					title: 'Plan d\'actions',
					root: true,
					alignment: 'left',
					page: '/plan-actions',
					translate: 'MENU.PLANACTION',
					needModule: true,
					moduleCode: ['PLANACTION']
				},
				{
					title: 'Matériel',
					root: true,
					alignment: 'left',
					page: '/materiel',
					translate: 'MENU.MATERIELS',
					needModule: true,
					moduleCode: ['MATERIEL']
				},
				{
					title: 'Clients',
					root: true,
					alignment: 'left',
					page: '/entreprises',
					translate: 'MENU.ENTREPRISES',
					needModule: true,
					moduleCode: ['ENTREPRISE'],
					permissionOnly: ['ROOT', 'ADMIN', 'MANAGER']
				},
				{
					title: 'Suivi Hse',
					root: true,
					alignment: 'left',
					page: '/suivi-hse',
					translate: 'MENU.SUIVI_HSE',
					needModule: true,
					moduleCode: ['SALARIES']
				},
				{
					title: 'Discuss',
					root: true,
					alignment: 'left',
					page: '/discuss',
					translate: 'MENU.DISCUSS',
					needModule: true,
					moduleCode: ['DISCUSS']
				},
				{
					title: 'Quizz',
					root: true,
					alignment: 'left',
					page: '/quizz',
					translate: 'MENU.QUIZ',
					needModule: true,
					moduleCode: ['QUIZ'],
					flag: 'is_quiz_approved'
				}

			]
		},

		subheader: {
			'visites-securite': {
				items: [
					{
						title: 'Visites sécurité Chantier',
						page: '/visites-securite/chantiers/list',
						needModule: true,
						translate: 'MENU.SUBHEADER.VISITS.VS_CHANTIER',
						moduleCode: ['CHANTIER']
					},
					{
						title: 'Visites sécurité EPI',
						page: '/visites-securite/epis/list',
						needModule: true,
						translate: 'MENU.SUBHEADER.VISITS.VS_EPI',
						moduleCode: ['MATERIEL']
					},
					{
						title: 'Visites sécurité Outillage',
						page: '/visites-securite/outillages/list',
						needModule: true,
						translate: 'MENU.SUBHEADER.VISITS.VS_OUTILLAGE',
						moduleCode: ['MATERIEL']
					},
					{
						title: 'Visites sécurité Véhicule',
						page: '/visites-securite/vehicules/list',
						needModule: true,
						translate: 'MENU.SUBHEADER.VISITS.VS_VEHICULE',
						moduleCode: ['MATERIEL']
					},
				]
			},
		},

		aside: {
			self: {},
			dashboard: {
				btnAdd: {},
				items: []
			},
			remontees: {
				btnAdd: {
					title: 'Nouvelle remontée',
					root: true,
					alignment: 'left',
					page: '/remontees/add',
					translate: 'MENU.BTN.NEWREMONTEE',
					permissionOnly: ['remontee_canAdd']
				},

				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/remontees/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/remontees/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					// {
					// 	title: 'Admin',
					// 	root: true,
					// 	alignment: 'left',
					// 	page: '/remontees/admin',
					// 	translate: 'MENU.ROOT',
					// 	icon: 'settings',
					// 	permissionOnly: ['ROOT', 'ADMIN'],
					// }
				]
			},
			chantiers: {
				btnAdd: {
					title: 'Nouveau chantier',
					root: true,
					alignment: 'left',
					page: '/chantiers/add',
					translate: 'MENU.BTN.NEWCHANTIER',
					permissionOnly: ['chantier_canAdd']
				},

				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/chantiers/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/chantiers/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/chantiers/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			ars: {
				btnAdd: {
					title: 'Nouvelle analyse de risque',
					root: true,
					alignment: 'left',
					page: '/analyses-risque/add',
					translate: 'MENU.BTN.NEWAR',
					permissionOnly: ['analyse_risque_canAdd']

				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/analyses-risque/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/analyses-risque/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/analyses-risque/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			pdp: {
				btnAdd: {
					title: 'Nouveau plan de prevention',
					root: true,
					alignment: 'left',
					page: '/plan-de-prevention/add',
					translate: 'MENU.BTN.NEWPDP',
					permissionOnly: ['analyse_risque_canAdd'] // todo : edit it when it's available

				},
				items: [
					// {
					// 	icon: 'dashboard',
					// 	title: 'Dashboards',
					// 	root: true,
					// 	alignment: 'left',
					// 	page: '/analyses-risque/dashboard',
					// 	translate: 'MENU.DASHBOARD',
					// },
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/plan-de-prevention/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/plan-de-prevention/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			materiels: {
				btnAdd: {
					title: 'Nouveau matériel',
					root: true,
					alignment: 'left',
					page: '/materiel/add',
					translate: 'MENU.BTN.NEWMATERIEL',
					permissionOnly: ['materiel_canAdd']
				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/materiel/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/materiel/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/materiel/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			vss_chantier: {
				btnAdd: {
					title: 'Nouvelle visite de sécurité chantier',
					root: true,
					alignment: 'left',
					page: '/visites-securite/chantiers/add',
					translate: 'MENU.BTN.NEWVS',
					permissionOnly: ['visite_securite_canAdd']
				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/visites-securite/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/chantiers/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/chantiers/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			vss_epi: {
				btnAdd: {
					title: 'Nouvelle visite de sécurité Epi',
					root: true,
					alignment: 'left',
					page: '/visites-securite/epis/add',
					translate: 'MENU.BTN.NEWVS',
					permissionOnly: ['visite_securite_canAdd']
				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/visites-securite/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/epis/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/epis/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			vss_vehicule: {
				btnAdd: {
					title: 'Nouvelle visite de sécurité Véhicule',
					root: true,
					alignment: 'left',
					page: '/visites-securite/vehicules/add',
					translate: 'MENU.BTN.NEWVS',
					permissionOnly: ['visite_securite_canAdd']
				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/visites-securite/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/vehicules/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/vehicules/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			vss_outillage: {
				btnAdd: {
					title: 'Nouvelle visite de sécurité Outillage',
					root: true,
					alignment: 'left',
					page: '/visites-securite/outillages/add',
					translate: 'MENU.BTN.NEWVS',
					permissionOnly: ['visite_securite_canAdd']
				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/visites-securite/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/outillages/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/outillages/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			entreprises: {
				btnAdd: {
					title: 'Nouveau client',
					root: true,
					alignment: 'left',
					page: '/entreprises/add',
					translate: 'MENU.BTN.NEWENTREPRISE',
					permissionOnly: ["entreprise_canAdd"]
				},

				items: [
					// {
					// 	icon: 'dashboard',
					// 	title: 'Dashboards',
					// 	root: true,
					// 	alignment: 'left',
					// 	page: '/entreprises/dashboard',
					// 	translate: 'MENU.DASHBOARD',
					// },
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/entreprises/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/entreprises/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			actions: {
				btnAdd: {
					title: 'Nouvelle Action',
					root: true,
					alignment: 'left',
					page: '/plan-actions/add',
					translate: 'MENU.BTN.NEWACTION',
					permissionOnly: ['action_canAdd']
				},

				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/plan-actions/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/plan-actions/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/plan-actions/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			suiviHse: {
				btnAdd: localStorage.getItem('user_connection') == 'hse' ? {
					title: 'Nouveau salarié',
					root: true,
					alignment: 'left',
					page: '/admin/users/add',
					translate: 'MENU.BTN.NEWACTION',
					permissionOnly: ['salarie_canAdd']
				} : {},

				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/suivi-hse/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/suivi-hse/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Objectifs',
						root: true,
						alignment: 'left',
						page: '/suivi-hse/goal',
						translate: 'MENU.GOALS',
						icon: 'filter_center_focus',
						permissionOnly: ['ADMIN', 'ROOT']
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/suivi-hse/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			formations: {
				btnAdd: {
					title: 'Nouvelle Formation',
					root: true,
					alignment: 'left',
					page: '/formations/add',
					translate: 'MENU.BTN.NEWFORMATION',
					permissionOnly: ['ROOT', 'ADMIN']
				},

				items: [
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/formations/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/formations/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
					}
				]
			},
			params: {
				btnAdd: {
					// title: 'Nouveau salarie',
					// root: true,
					// alignment: 'left',
					// page: '/salaries/add',
					// translate: 'MENU.BTN.NEWACTION',
				},
				items: [
					{
						title: 'Flash Infos',
						root: true,
						alignment: 'left',
						page: '/admin/flash-infos',
						translate: 'MENU.FLASHINFOS',
						needModule: false,
						svgIcon: 'administration'
					},
					{
						title: 'Utilisateurs',
						root: true,
						alignment: 'left',
						page: '/admin/users',
						translate: 'MENU.USERS',
						needModule: false,
						svgIcon: 'administration'
					},
					{
						title: 'Salariés',
						root: true,
						alignment: 'left',
						page: '/admin/salaries',
						translate: 'MENU.SALARIES',
						needModule: true,
						svgIcon: 'administration'
					},
					{
						title: 'Chantiers',
						root: true,
						alignment: 'left',
						page: '/admin/chantiers',
						translate: 'MENU.CHANTIER',
						needModule: true,
						moduleCode: ['CHANTIER'],
						svgIcon: 'chantier'
					},
					{
						title: 'Analyses de risque',
						root: true,
						alignment: 'left',
						page: '/admin/analyses-risque',
						translate: 'MENU.ANALYSERISQUE',
						needModule: true,
						moduleCode: ['ANALYSE'],
						svgIcon: 'analyse'
					},
					{
						title: 'Plan de prévention',
						root: true,
						alignment: 'left',
						page: '/admin/plan-de-prevention',
						translate: 'MENU.PLANDEPREVENTION',
						needModule: true,
						moduleCode: ['PLAN_DE_PREVENTION'],
						svgIcon: 'plan-daction'
					},
					{
						title: 'Visites de securité',
						root: true,
						alignment: 'left',
						page: '/admin/visites-securite',
						translate: 'MENU.VISITESECURITE',
						needModule: true,
						moduleCode: ['VISITE'],
						svgIcon: 'visite-de-securite'
					},
					{
						title: 'Plans d\'action',
						root: true,
						alignment: 'left',
						page: '/admin/plan-actions',
						translate: 'MENU.PLANACTION',
						needModule: true,
						moduleCode: ['PLANACTION'],
						svgIcon: 'plan-daction'
					},
					{
						title: 'Suivi HSE',
						root: true,
						alignment: 'left',
						page: '/admin/suivi-hse',
						translate: 'MENU.SUIVI_HSE',
						needModule: true,
						moduleCode: ['SALARIES'],
						svgIcon: 'administration'
					},
					{
						title: 'Clients',
						root: true,
						alignment: 'left',
						page: '/admin/entreprises',
						translate: 'MENU.ENTREPRISES',
						needModule: true,
						moduleCode: ['ENTREPRISE'],
						svgIcon: 'business'
					},
					{
						title: 'Matériel',
						root: true,
						alignment: 'left',
						page: '/admin/materiel',
						translate: 'MENU.MATERIELS',
						needModule: true,
						moduleCode: ['MATERIEL'],
						svgIcon: 'construction'
					},
					{
						title: 'Formations',
						root: true,
						alignment: 'left',
						page: '/admin/formations',
						translate: 'MENU.FORMATION',
						needModule: false,
						// moduleCode: ['FORMATIONS'],
						svgIcon: 'business'
					},
					{
						title: 'Habilitations',
						root: true,
						alignment: 'left',
						page: '/admin/habilitations',
						translate: 'MENU.HABILITATION',
						needModule: false,
						// moduleCode: ['FORMATIONS'],
						svgIcon: 'chantier'
					},
					{
						title: 'Modules',
						root: true,
						alignment: 'left',
						page: '/admin/modules',
						translate: 'MENU.MODULES',
						needModule: false,
						permissionOnly: ['ROOT'],
						svgIcon: 'dashboard'

					},
				]
			},
			items: {
				btnAdd: {
					title: 'Nouveau chantier',
					root: true,
					alignment: 'left',
					page: '/chantiers/add',
					translate: 'MENU.BTN.NEWCHANTIER',
				},
				items: [
					{
						icon: 'dashboard',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Chantiers',
						root: true,
						alignment: 'left',
						page: '/chantiers/list',
						translate: 'MENU.CHANTIER',
						icon: 'chantier',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/chantiers/admin',
						translate: 'MENU.ROOT',
						icon: 'administration',
						permissionOnly: ['ROOT', 'ADMIN'],
					},
				]
			}
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}

export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					needModule: false,
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
					title: 'Entreprises Externes',
					root: true,
					alignment: 'left',
					page: '/entreprises',
					translate: 'MENU.ENTREPRISES',
					needModule: true,
					moduleCode: ['ENTREPRISE']
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
					title: 'Paramètres',
					root: true,
					alignment: 'left',
					page: '/admin',
					translate: 'MENU.ROOT',
					permissionOnly: ['ROOT', 'ADMIN'],
					needModule: false,
				},
				// {
				// 	title: 'Components',
				// 	root: true,
				// 	alignment: 'left',
				// 	toggle: 'click',
				// 	submenu: [
				// 		{
				// 			title: 'Google Material',
				// 			bullet: 'dot',
				// 			icon: 'flaticon-interface-7',
				// 			submenu: [
				// 				{
				// 					title: 'Form Controls',
				// 					bullet: 'dot',
				// 					submenu: [
				// 						{
				// 							title: 'Auto Complete',
				// 							page: '/material/form-controls/autocomplete',
				// 							permission: 'accessToECommerceModule'
				// 						},
				// 						{
				// 							title: 'Checkbox',
				// 							page: '/material/form-controls/checkbox'
				// 						},
				// 						{
				// 							title: 'Radio Button',
				// 							page: '/material/form-controls/radiobutton'
				// 						},
				// 						{
				// 							title: 'Datepicker',
				// 							page: '/material/form-controls/datepicker'
				// 						},
				// 						{
				// 							title: 'Form Field',
				// 							page: '/material/form-controls/formfield'
				// 						},
				// 						{
				// 							title: 'Input',
				// 							page: '/material/form-controls/input'
				// 						},
				// 						{
				// 							title: 'Select',
				// 							page: '/material/form-controls/select'
				// 						},
				// 						{
				// 							title: 'Slider',
				// 							page: '/material/form-controls/slider'
				// 						},
				// 						{
				// 							title: 'Slider Toggle',
				// 							page: '/material/form-controls/slidertoggle'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					title: 'Navigation',
				// 					bullet: 'dot',
				// 					submenu: [
				// 						{
				// 							title: 'Menu',
				// 							page: '/material/navigation/menu'
				// 						},
				// 						{
				// 							title: 'Sidenav',
				// 							page: '/material/navigation/sidenav'
				// 						},
				// 						{
				// 							title: 'Toolbar',
				// 							page: '/material/navigation/toolbar'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					title: 'Layout',
				// 					bullet: 'dot',
				// 					submenu: [
				// 						{
				// 							title: 'Card',
				// 							page: '/material/layout/card'
				// 						},
				// 						{
				// 							title: 'Divider',
				// 							page: '/material/layout/divider'
				// 						},
				// 						{
				// 							title: 'Expansion panel',
				// 							page: '/material/layout/expansion-panel'
				// 						},
				// 						{
				// 							title: 'Grid list',
				// 							page: '/material/layout/grid-list'
				// 						},
				// 						{
				// 							title: 'List',
				// 							page: '/material/layout/list'
				// 						},
				// 						{
				// 							title: 'Tabs',
				// 							page: '/material/layout/tabs'
				// 						},
				// 						{
				// 							title: 'Stepper',
				// 							page: '/material/layout/stepper'
				// 						},
				// 						{
				// 							title: 'Default Forms',
				// 							page: '/material/layout/default-forms'
				// 						},
				// 						{
				// 							title: 'Tree',
				// 							page: '/material/layout/tree'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					title: 'Buttons & Indicators',
				// 					bullet: 'dot',
				// 					submenu: [
				// 						{
				// 							title: 'Button',
				// 							page: '/material/buttons-and-indicators/button'
				// 						},
				// 						{
				// 							title: 'Button toggle',
				// 							page: '/material/buttons-and-indicators/button-toggle'
				// 						},
				// 						{
				// 							title: 'Chips',
				// 							page: '/material/buttons-and-indicators/chips'
				// 						},
				// 						{
				// 							title: 'Icon',
				// 							page: '/material/buttons-and-indicators/icon'
				// 						},
				// 						{
				// 							title: 'Progress bar',
				// 							page: '/material/buttons-and-indicators/progress-bar'
				// 						},
				// 						{
				// 							title: 'Progress spinner',
				// 							page: '/material/buttons-and-indicators/progress-spinner'
				// 						},
				// 						{
				// 							title: 'Ripples',
				// 							page: '/material/buttons-and-indicators/ripples'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					title: 'Popups & Modals',
				// 					bullet: 'dot',
				// 					submenu: [
				// 						{
				// 							title: 'Bottom sheet',
				// 							page: '/material/popups-and-modals/bottom-sheet'
				// 						},
				// 						{
				// 							title: 'Dialog',
				// 							page: '/material/popups-and-modals/dialog'
				// 						},
				// 						{
				// 							title: 'Snackbar',
				// 							page: '/material/popups-and-modals/snackbar'
				// 						},
				// 						{
				// 							title: 'Tooltip',
				// 							page: '/material/popups-and-modals/tooltip'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					title: 'Data table',
				// 					bullet: 'dot',
				// 					submenu: [
				// 						{
				// 							title: 'Paginator',
				// 							page: '/material/data-table/paginator'
				// 						},
				// 						{
				// 							title: 'Sort header',
				// 							page: '/material/data-table/sort-header'
				// 						},
				// 						{
				// 							title: 'Table',
				// 							page: '/material/data-table/table'
				// 						}
				// 					]
				// 				}
				// 			]
				// 		},
				// 		{
				// 			title: 'Ng-Bootstrap',
				// 			bullet: 'dot',
				// 			icon: 'flaticon-web',
				// 			submenu: [
				// 				{
				// 					title: 'Accordion',
				// 					page: '/ngbootstrap/accordion'
				// 				},
				// 				{
				// 					title: 'Alert',
				// 					page: '/ngbootstrap/alert'
				// 				},
				// 				{
				// 					title: 'Buttons',
				// 					page: '/ngbootstrap/buttons'
				// 				},
				// 				{
				// 					title: 'Carousel',
				// 					page: '/ngbootstrap/carousel'
				// 				},
				// 				{
				// 					title: 'Collapse',
				// 					page: '/ngbootstrap/collapse'
				// 				},
				// 				{
				// 					title: 'Datepicker',
				// 					page: '/ngbootstrap/datepicker'
				// 				},
				// 				{
				// 					title: 'Dropdown',
				// 					page: '/ngbootstrap/dropdown'
				// 				},
				// 				{
				// 					title: 'Modal',
				// 					page: '/ngbootstrap/modal'
				// 				},
				// 				{
				// 					title: 'Pagination',
				// 					page: '/ngbootstrap/pagination'
				// 				},
				// 				{
				// 					title: 'Popover',
				// 					page: '/ngbootstrap/popover'
				// 				},
				// 				{
				// 					title: 'Progressbar',
				// 					page: '/ngbootstrap/progressbar'
				// 				},
				// 				{
				// 					title: 'Rating',
				// 					page: '/ngbootstrap/rating'
				// 				},
				// 				{
				// 					title: 'Tabs',
				// 					page: '/ngbootstrap/tabs'
				// 				},
				// 				{
				// 					title: 'Timepicker',
				// 					page: '/ngbootstrap/timepicker'
				// 				},
				// 				{
				// 					title: 'Tooltips',
				// 					page: '/ngbootstrap/tooltip'
				// 				},
				// 				{
				// 					title: 'Typehead',
				// 					page: '/ngbootstrap/typehead'
				// 				}
				// 			]
				// 		},
				// 	]
				// },
				// {
				// 	title: 'Applications',
				// 	root: true,
				// 	alignment: 'left',
				// 	toggle: 'click',
				// 	submenu: [
				// 		{
				// 			title: 'eCommerce',
				// 			bullet: 'dot',
				// 			icon: 'flaticon-business',
				// 			permission: 'accessToECommerceModule',
				// 			submenu: [
				// 				{
				// 					title: 'Customers',
				// 					page: '/ecommerce/customers'
				// 				},
				// 				{
				// 					title: 'Products',
				// 					page: '/ecommerce/products'
				// 				},
				// 			]
				// 		},
				// 		{
				// 			title: 'User Management',
				// 			bullet: 'dot',
				// 			icon: 'flaticon-user',
				// 			// submenu: [
				// 			// 	{
				// 			// 		title: 'Users',
				// 			// 		page: '/user-management/users'
				// 			// 	},
				// 			// 	{
				// 			// 		title: 'Roles',
				// 			// 		page: '/user-management/roles'
				// 			// 	}
				// 			// ]
				// 		},
				// 	]
				// },
				// {
				// 	title: 'Custom',
				// 	root: true,
				// 	alignment: 'left',
				// 	toggle: 'click',
				// 	submenu: [
				// 		{
				// 			title: 'Error Pages',
				// 			bullet: 'dot',
				// 			icon: 'flaticon2-list-2',
				// 			submenu: [
				// 				{
				// 					title: 'Error 1',
				// 					page: '/error/error-v1'
				// 				},
				// 				{
				// 					title: 'Error 2',
				// 					page: '/error/error-v2'
				// 				},
				// 				{
				// 					title: 'Error 3',
				// 					page: '/error/error-v3'
				// 				},
				// 				{
				// 					title: 'Error 4',
				// 					page: '/error/error-v4'
				// 				},
				// 				{
				// 					title: 'Error 5',
				// 					page: '/error/error-v5'
				// 				},
				// 				{
				// 					title: 'Error 6',
				// 					page: '/error/error-v6'
				// 				},
				// 			]
				// 		},
				// 		{
				// 			title: 'Wizard',
				// 			bullet: 'dot',
				// 			icon: 'flaticon2-mail-1',
				// 			submenu: [
				// 				{
				// 					title: 'Wizard 1',
				// 					page: '/wizard/wizard-1'
				// 				},
				// 				{
				// 					title: 'Wizard 2',
				// 					page: '/wizard/wizard-2'
				// 				},
				// 				{
				// 					title: 'Wizard 3',
				// 					page: '/wizard/wizard-3'
				// 				},
				// 				{
				// 					title: 'Wizard 4',
				// 					page: '/wizard/wizard-4'
				// 				},
				// 			]
				// 		},
				// 	]
				// },
			]
		},

		subheader: {
			'visites-securite': {
				items: [
					{
						title: 'Visites sécurité Chantier',
						page: '/visites-securite/chantiers/list',
						needModule: true,
						moduleCode: ['CHANTIER']
					},
					{
						title: 'Visites sécurité EPI',
						page: '/visites-securite/epis/list',
						needModule: true,
						moduleCode: ['MATERIEL']
					},
					{
						title: 'Visites sécurité Outillage',
						page: '/visites-securite/outillages/list',
						needModule: true,
						moduleCode: ['MATERIEL']
					},
					{
						title: 'Visites sécurité Véhicule',
						page: '/visites-securite/vehicules/list',
						needModule: true,
						moduleCode: ['MATERIEL']
					},
				]
			},
		},

		aside: {
			self: {},
			dashboard: {
				btnAdd:{},
				items:[]
			},
			chantiers: {
				btnAdd: {
					title: 'Nouveau chantier',
					root: true,
					alignment: 'left',
					page: '/chantiers/add',
					translate: 'MENU.BTN.NEWCHANTIER',
					permissionOnly:['chantier_canAdd']
				},

				items: [
					{
						icon: 'dashboard',
						// icon: 'flaticon2-browser-2',
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
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/chantiers/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
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
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/analyses-risque/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/materiel/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/materiel/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/chantiers/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/chantiers/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/epis/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/epis/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/vehicules/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/vehicules/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/visites-securite/outillages/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/visites-securite/outillages/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
					}
				]
			},
			entreprises: {
				btnAdd: {
					title: 'Nouvelle entreprise',
					root: true,
					alignment: 'left',
					page: '/entreprises/add',
					translate: 'MENU.BTN.NEWENTREPRISE',
					permissionOnly: ["entreprise_canAdd"]
				},

				items: [
					{
						icon: 'dashboard',
						// icon: 'flaticon2-browser-2',
						title: 'Dashboards',
						root: true,
						alignment: 'left',
						page: '/dentreprises/dashboard',
						translate: 'MENU.DASHBOARD',
					},
					{
						title: 'Liste',
						root: true,
						alignment: 'left',
						page: '/entreprises/list',
						translate: 'MENU.LIST',
						icon: 'view_list',
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/entreprises/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
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
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/plan-actions/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						// icon: 'flaticon2-browser-2',
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
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Objectifs',
						root: true,
						alignment: 'left',
						page: '/suivi-hse/goal',
						translate: 'MENU.ROOT',
						icon: 'filter_center_focus',
						permissionOnly: ['ADMIN','ROOT']
						// icon: 'flaticon2-mail-1',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/suivi-hse/admin',
						translate: 'MENU.ROOT',
						icon: 'settings',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
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
						needModule: false,
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
						title: 'Entreprises externes',
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
						// icon: 'flaticon2-browser-2',
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
						// icon: 'flaticon2-browser-2',
					},
					{
						title: 'Admin',
						root: true,
						alignment: 'left',
						page: '/chantiers/admin',
						translate: 'MENU.ROOT',
						icon: 'administration',
						permissionOnly: ['ROOT', 'ADMIN'],
						// icon: 'flaticon2-mail-1',
					},
				]
			}
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}

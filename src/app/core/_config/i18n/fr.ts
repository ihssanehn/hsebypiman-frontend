// France
export const locale = {
	lang: 'fr',
	data: {
		TRANSLATOR: {
			SELECT: 'choisissez votre langue',
		},
		ACTION:{
			ADD:'Ajouter',
			EDIT:'Modifier',
			READ:'Consulter',
			DELETE:'Supprimer',
			SAVE:'Sauvegarder'
		},
		MENU: {
			NEW: 'Nouveau',
			ACTIONS: 'Actes',
			CREATE_POST: 'Créer un nouveau Post',
			PAGES: 'Pages',
			FEATURES: 'Fonctionnalités',
			APPS: 'Applications',
			DASHBOARD: 'Tableau de Bord',
			CHANTIER: 'Chantier',
			ANALYSERISQUE: 'Analyse de risque',
			VISITESECURITE: 'Visite de Sécurité',
			PLANACTION: 'Plan d\'action',
			SALARIES: 'Salariés',
			SOUSTRAITANTS: 'Sous-traiants',
			ADMIN: 'Admin',
			BTN:{
				NEWAR: 'Nouvelle analyse de risque',
				NEWCHANTIER: 'Nouveau chantier'
			}
		},
		AUTH: {
			GENERAL: {
				OR: 'Ou',
				SUBMIT_BUTTON: 'Soumettre',
				NO_ACCOUNT: 'Ne pas avoir de compte?',
				SIGNUP_BUTTON: 'Registre',
				FORGOT_BUTTON: 'Mot de passe oublié',
				BACK_BUTTON: 'Back',
				PRIVACY: 'Privacy',
				LEGAL: 'Legal',
				CONTACT: 'Contact',
			},
			LOGIN: {
				TITLE: 'Accéder à la <b>plateforme</b>',
				BUTTON: 'Se Connecter',
			},
			FORGOT: {
				TITLE: 'Forgotten Password?',
				DESC: 'Enter your email to reset your password',
				SUCCESS: 'Your account has been successfully reset.'
			},
			REGISTER: {
				TITLE: 'Créer un compte',
				DESC: 'Enter your details to create your account',
				SUCCESS: 'Your account has been successfuly registered.'
			},
			INPUT: {
				EMAIL: 'Email',
				FULLNAME: 'Fullname',
				PASSWORD: 'Mot de passe',
				CONFIRM_PASSWORD: 'Confirm Password',
				USERNAME: 'Nom d\'utilisateur'
			},
			VALIDATION: {
				INVALID: '{{name}} n\'est pas valide',
				REQUIRED: '{{name}} est requis',
				MIN_LENGTH: '{{name}} minimum length is {{min}}',
				AGREEMENT_REQUIRED: 'Accepting terms & conditions are required',
				NOT_FOUND: 'The requested {{name}} is not found',
				INVALID_LOGIN: 'The login detail is incorrect',
				REQUIRED_FIELD: 'Required field',
				MIN_LENGTH_FIELD: 'Minimum field length:',
				MAX_LENGTH_FIELD: 'Maximum field length:',
				INVALID_FIELD: 'Field is not valid',
			},
			LOGOUT: 'Se déconnecter'
		},
		CHANTIERS:{
			NUMBER:{
				LABEL:'Numéro',
				PLACEHOLDER:'',
				TITLE:'Numéro'
			},
			CLIENT:{
				LABEL:'Client',
				PLACEHOLDER:'',
				TITLE:'Client'
			},
			NAME:{
				LABEL:'Nom du chantier',
				PLACEHOLDER:'',
				TITLE:'Nom du chantier'
			},
			ADRESS:{
				LABEL:'Adresse du chantier',
				PLACEHOLDER:'',
				TITLE:'Adresse du chantier'
			},
			TYPE:{
				LABEL:'Type',
				PLACEHOLDER:'',
				TITLE:'Type'
			},
			STATUS:{
				LABEL:'Statut',
				PLACEHOLDER:'',
				TITLE:'Statut'
			},
			CONTACT:{
				LABEL:'Contact',
				PLACEHOLDER:'',
				TITLE:'Contact'
			},
			DATE_DEMARRAGE:{
				LABEL:'Date de démarage chantier',
				PLACEHOLDER:'',
				TITLE:'Date de démarage chantier'
			},
			AR: 'Analyse de risque',
			CHIEF:{
				LABEL:'Chargé d\'affaire',
				PLACEHOLDER:'',
				TITLE:'Chargé d\'affaire'
			},
			BUDGET:{
				LABEL:'Budget',
				PLACEHOLDER:'',
				TITLE:'Budget'
			},
			ARCOUNT:{
				LABEL:'Quantité A.R',
				PLACEHOLDER:'',
				TITLE:'Quantité A.R'
			},
			LASTAR:{
				LABEL:'Dernière A.R',
				PLACEHOLDER:'',
				TITLE:'Dernière A.R'
			},
			VSCOUNT:{
				LABEL:'Quantité V.S',
				PLACEHOLDER:'',
				TITLE:'Quantité V.S'
			},
			LASTVS:{
				LABEL:'Dernière V.S',
				PLACEHOLDER:'',
				TITLE:'Dernière V.S'
			},
			FORM:{
				CREATE:'Créer un nouveau chantier'
			}
		},
		ARS:{
			NUMBER:'Numéro',
			CLIENT:'Client',
			NAME:'Nom du chantier',
			ADRESS:'Adresse du chantier',
			TYPE:'Type',
			STATUS:'Statut',
			CONTACT:'Contact',
			DATE_DEMARRAGE:'Date de démarage chantier pour CVTI',
			AR: 'Analyse de risque',
			EMPLOYEE:'Nom du salarié CVTI réalisant la visite commune',
			CHIEF:'Chargé d\'affaire',
			BUDGET:'Budget',
			ARCOUNT:'Quantité A.R',
			LASTAR:'Dernière A.R',
			VSCOUNT:'Quantité V.S',
			LASTVS:'Dernière V.S',
			FORM:{
				CREATE:'Créer une nouvelle analyse de risque',
				RISKBLOCK:{
					TITLE: 'Risques liés au chantier et moyens de préventions',
					MSG: 'Obligatoirement port des EPI standard chez CVTI : casque, gants, vêtements couvrants, chaussures. Casquette tolérée pour le travail dans les faux plafonds (en fonction PDP du client). Si bruit port du casque antibruit pour les autres risques, adopter l’attitude suivante et cocher les actions à mener :'
				},
				PARKINGBLOCK:{
					TITLE: 'Zone de stationnement des véhicules pendant le chantier'
				},
				STOCKBLOCK:{
					TITLE: 'Zone de stockage matériel chantier'
				},
				EQBLOCK:{
					TITLE: 'Equipement à prévoir sur le chantier'
				},
				MWBLOCK:{
					TITLE: 'Suivi des travaux ',
					WORKREGISTER:{
						TITLE: 'Registre de travaux à signer ',
						MSG: 'Si oui renseigner les informations ci-dessous en charge du registre'
					},
					SUBTITLE2: 'Balisage à prévoir sur la zone'
				},
				SIGNATURE:{
					TITLE: 'Observation et signatures',
					SUBTITLE: 'Observations des signataires sur les risques',
					DECLARATION: 'J’ai pris connaissance de l’analyse de risque du chantier, du PPSPS ou du PDP et applique les moyens de préventions nécessaires : '
				},
				RISKS: 'Les risques',
				ACTION: 'Action de prévention à mener',
				COMMENT: 'Précisions à apporter',
				CVTI_RESPONSIBLE: 'Nom du chargé d’affaire CVTI',
				CA_ASSISTANT: 'Assistant CA'
			},
			DATE:{
				LABEL:'Date de l\'analyse de risque',
				PLACEHOLDER:'',
				TITLE:'Date de l\'analyse de risque'
			},
			PREVOIR_COMPAGNONS:{
				LABEL:'A prévoir pour les compagnons',
				PLACEHOLDER:'',
				TITLE:'A prévoir pour les compagnons'
			},
			DATE_ACCUEIL_SECU:{
				LABEL:'Date de l\'accueil sécurité',
				PLACEHOLDER:'',
				TITLE:'Date de l\'accueil sécurité'
			},
			REALISATEUR:{
				LABEL:'Personne en charge de réaliser l\'accueil',
				PLACEHOLDER:'',
				TITLE:'Personne en charge de réaliser l\'accueil'
			},
			TEL_REALISATEUR:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone'
			},
			DATE_VALIDITE:{
				LABEL:'Date de validité de l\'accueuil sécurité',
				PLACEHOLDER:'',
				TITLE:'Date de validité de l\'accueuil sécurité'
			},
			NUM_SECOURS:{
				LABEL:'Numéro en cas d\'accident ou incendie',
				PLACEHOLDER:'',
				TITLE:'Numéro en cas d\'accident ou incendie'
			},
			CONTACT_INTERNE_SECOURS:{
				LABEL:'Personne CVTI à contacter en cas d\'accident',
				PLACEHOLDER:'',
				TITLE:'Personne CVTI à contacter en cas d\'accident'
			},
			TEL_CONTACT_INTERNE_SECOURS:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone'
			},
			CONTACT_CLIENT_CHEF_CHANTIER:{
				LABEL:'Nom Chef de chantier client',
				PLACEHOLDER:'',
				TITLE:'Nom Chef de chantier client'
			},
			TEL_CONTACT_CLIENT_CHEF_CHANTIER:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone'
			},
			CONTACT_CLIENT_HSE:{
				LABEL:'Interlocuteur HSE ou SPS',
				PLACEHOLDER:'',
				TITLE:'Interlocuteur HSE ou SPS'
			},
			TEL_CONTACT_CLIENT_HSE:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone'
			},
			HORAIRES:{
				LABEL:'Heures de travail du chantier',
				PLACEHOLDER:'',
				TITLE:'Heures de travail du chantier'
			},
			COURANT:{
				LABEL:'Courant mis à disposition',
				PLACEHOLDER:'',
				TITLE:'Courant mis à disposition'
			},
		},
		ECOMMERCE: {
			COMMON: {
				SELECTED_RECORDS_COUNT: 'Nombre d\'enregistrements sélectionnés: ',
				ALL: 'All',
				SUSPENDED: 'Suspended',
				ACTIVE: 'Active',
				FILTER: 'Filter',
				BY_STATUS: 'by Status',
				BY_TYPE: 'by Type',
				BUSINESS: 'Business',
				INDIVIDUAL: 'Individual',
				SEARCH: 'Search',
				IN_ALL_FIELDS: 'in all fields'
			},
			ECOMMERCE: 'éCommerce',
			CUSTOMERS: {
				CUSTOMERS: 'Les clients',
				CUSTOMERS_LIST: 'Liste des clients',
				NEW_CUSTOMER: 'Nouveau client',
				DELETE_CUSTOMER_SIMPLE: {
					TITLE: 'Suppression du client',
					DESCRIPTION: 'Êtes-vous sûr de supprimer définitivement ce client?',
					WAIT_DESCRIPTION: 'Le client est en train de supprimer ...',
					MESSAGE: 'Le client a été supprimé'
				},
				DELETE_CUSTOMER_MULTY: {
					TITLE: 'Supprimer les clients',
					DESCRIPTION: 'Êtes-vous sûr de supprimer définitivement les clients sélectionnés?',
					WAIT_DESCRIPTION: 'Les clients suppriment ...',
					MESSAGE: 'Les clients sélectionnés ont été supprimés'
				},
				UPDATE_STATUS: {
					TITLE: 'Le statut a été mis à jour pour les clients sélectionnés',
					MESSAGE: 'Le statut des clients sélectionnés a été mis à jour avec succès'
				},
				EDIT: {
					UPDATE_MESSAGE: 'Le client a été mis à jour',
					ADD_MESSAGE: 'Le client a été créé'
				}
			}
		},
		COMMON:{
			CITY:{
				LABEL:'Ville',
				PLACEHOLDER:'',
				TITLE:'Ville'
			},
			POSTCODE:{
				LABEL:'Code Postal',
				PLACEHOLDER:'',
				TITLE:'Code Postal'
			},
			COUNTRY:{
				LABEL:'Pays',
				PLACEHOLDER:'',
				TITLE:'Pays'
			},
			ADRESS:{
				LABEL:'Adresse',
				PLACEHOLDER:'',
				TITLE:'Adresse'
			},
			NAME:{
				LABEL:'Nom',
				PLACEHOLDER:'',
				TITLE:'Nom'
			},
			PHONENUMBER:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone'
			},
			DATE:{
				LABEL:'Date',
				PLACEHOLDER:'',
				TITLE:'Date'
			},
			NOM_PRENOM:{
				LABEL:'Nom Prénom',
				PLACEHOLDER:'',
				TITLE:'Nom Prénom'
			},
			SOCIETE:{
				LABEL:'Société',
				PLACEHOLDER:'',
				TITLE:'Société'
			},
			SIGNATURE:{
				LABEL:'Signature',
				PLACEHOLDER:'',
				TITLE:'Signature'
			},
			REMARQUE:{
				LABEL:'Remarques',
				PLACEHOLDER:'',
				TITLE:'Remarques'
			}
		
		},
		FILTER : {
			TITLE : "Filtres",
			SHOW : "Afficher",
			HIDE : "Cacher",
			SEARCH : "Rechercher",
			KEYWORD : "Rechercher",
			SELECT_ROLE : "Selectionnez un role",
			SEARCH_KEYWORD : "Recherche par mot clé",
			STATUS : "Statut",
			SELECT_STATUS : "Sélectionnez un status",
			CREATION_DATE : "Date de création",
			SEARCH_CHANTIER : "Recherche un chantier",
		},
	}
};

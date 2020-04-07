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
			DASHBOARD: 'Tableau de Bord',
			CHANTIER: 'Chantiers',
			SUB_CHANTIER:{
				DETAIL:'Détail du chantier',
				ADD:'Ajouter un nouveau chantier',
				EDIT:'Modifier le chantier',
				LIST:'Liste des chantiers',
			},
			ANALYSERISQUE: 'Analyses de risque',
			SUB_ANALYSERISQUE:{
				DETAIL:'Détail de l\'analyse de risque',
				ADD:'Ajouter une analyse de risque',
				EDIT:'Modifier l\'analyse de risque',
				LIST:'Liste des analyses de risque',
			},
			VISITESECURITE: 'Visites de Sécurité',
			SUB_VISITESECURITE:{
				DETAIL:'Détail de la visite de Sécurité',
				ADD:'Ajouter une visite de Sécurité',
				EDIT:'Modifier la visite de Sécurité',
				LIST:'Liste des visites de Sécurité',
			},
			PLANACTION: 'Plan d\'action',
			SUB_PLANACTION:{
				DETAIL:'Détail de l\'action',
				ADD:'Ajouter une action',
				EDIT:'Modifier l\'action',
				LIST:'Liste des actions',
			},
			SALARIES: 'Salariés',
			SUB_SALARIES:{
				DETAIL:'Détail du salarié',
				ADD:'Ajouter un salarié',
				EDIT:'Modifier le salarié',
				LIST:'Liste des salariés',
			},
			SOUSTRAITANTS: 'Sous-traitants',
			SUB_SOUSTRAITANTS:{
				DETAIL:'Détail du sous-traitant',
				ADD:'Ajouter un sous-traitant',
				EDIT:'Modifier le sous-traitant',
				LIST:'Liste des sous-traitants',
			},
			ADMIN: 'Admin',
			SUB_ADMIN:{},
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
				TITLE:'Numéro du chantier',
				SHORTTITLE:'Numéro'
			},
			CLIENT:{
				LABEL:'Client',
				PLACEHOLDER:'',
				TITLE:'Client',
				SHORTTITLE:'Client'
			},
			NAME:{
				LABEL:'Nom du chantier',
				PLACEHOLDER:'',
				TITLE:'Nom du chantier',
				SHORTTITLE: 'Nom'
			},
			ADRESS:{
				LABEL:'Adresse du chantier',
				PLACEHOLDER:'',
				TITLE:'Adresse du chantier',
				SHORTTITLE: 'Adresse'
			},
			TYPE:{
				LABEL:'Type',
				PLACEHOLDER:'',
				TITLE:'Type',
				SHORTTITLE:'Type'
			},
			STATUS:{
				LABEL:'Statut',
				PLACEHOLDER:'',
				TITLE:'Statut actuel du chantier',
				SHORTTITLE:'Statut'
			},
			CONTACT:{
				LABEL:'Contact',
				PLACEHOLDER:'',
				TITLE:'Contact',
				SHORTTITLE:'Contact',
			},
			DATE_DEMARRAGE:{
				LABEL:'Date de démarage chantier',
				PLACEHOLDER:'',
				TITLE:'Date de démarage chantier',
				SHORTTITLE:'Date de démarage',
			},
			AR: 'Analyse de risque',
			CHIEF:{
				LABEL:'Chargé d\'affaire',
				PLACEHOLDER:'',
				TITLE:'Chargé d\'affaire',
				SHORTTITLE:'Nom',
			},
			BUDGET:{
				LABEL:'Budget',
				PLACEHOLDER:'',
				TITLE:'Budget',
				SHORTTITLE:'Montant',
			},
			ARCOUNT:{
				LABEL:'Quantité A.R',
				PLACEHOLDER:'',
				TITLE:'Quantité A.R',
				SHORTTITLE:'Nombre d\'analyses',
			},
			LASTAR:{
				LABEL:'Dernière A.R',
				PLACEHOLDER:'',
				TITLE:'Dernière A.R',
				SHORTTITLE:'Dernière A.R',
			},
			NEXTAR:{
				LABEL:'Prochaine A.R',
				PLACEHOLDER:'',
				TITLE:'Prochaine analyse de prévue',
				SHORTTITLE:'Prochaine analyse',
			},
			ARS:{
				PLACEHOLDER:'',
				TITLE:'Prochaine analyse de prévue',
				SHORTTITLE:'Prochaine analyse',
			},
			VSCOUNT:{
				LABEL:'Quantité V.S',
				PLACEHOLDER:'',
				TITLE:'Quantité V.S',
				SHORTTITLE:'Nombre de visites',
			},
			LASTVS:{
				LABEL:'Dernière V.S',
				PLACEHOLDER:'',
				TITLE:'Dernière V.S',
				SHORTTITLE:'Dernière V.S',
			},
			NEXTVS:{
				LABEL:'Prochaine V.S',
				PLACEHOLDER:'',
				TITLE:'Prochaine V.S',
				SHORTTITLE:'Prochaine visite de prévue',
			},
			VSS:{
				PLACEHOLDER:'',
				TITLE:'Visites passées',
				SHORTTITLE:'Visites passées',
			},
			FORM:{
				CREATE:'Créer un nouveau chantier'
			}
		},
		ARS:{
			DATE:{
				LABEL:'Date de l\'analyse de risque',
				PLACEHOLDER:'',
				TITLE:'Date de l\'analyse de risque',
				SHORTTITLE:'Date de l\'analyse de risque',
			},
			PREVOIR_COMPAGNONS:{
				LABEL:'A prévoir pour les compagnons',
				PLACEHOLDER:'',
				TITLE:'A prévoir pour les compagnons',
				SHORTTITLE:'A prévoir pour les compagnons',
			},
			DATE_ACCUEIL_SECU:{
				LABEL:'Date de l\'accueil sécurité',
				PLACEHOLDER:'',
				TITLE:'Date de l\'accueil sécurité',
				SHORTTITLE:'Date de l\'accueil sécurité',
			},
			REALISATEUR:{
				LABEL:'Personne en charge de réaliser l\'accueil',
				PLACEHOLDER:'',
				TITLE:'Personne en charge de réaliser l\'accueil',
				SHORTTITLE:'Personne en charge de réaliser l\'accueil',
			},
			TEL_REALISATEUR:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			DATE_VALIDITE:{
				LABEL:'Date de validité de l\'accueuil sécurité',
				PLACEHOLDER:'',
				TITLE:'Date de validité de l\'accueuil sécurité',
				SHORTTITLE:'Date de validité de l\'accueuil sécurité',
			},
			NUM_SECOURS:{
				LABEL:'Numéro en cas d\'accident ou incendie',
				PLACEHOLDER:'',
				TITLE:'Numéro en cas d\'accident ou incendie',
				SHORTTITLE:'En cas d\'accident ou incendie',
			},
			CONTACT_INTERNE_SECOURS:{
				LABEL:'Personne CVTI à contacter en cas d\'accident',
				PLACEHOLDER:'',
				TITLE:'Personne CVTI à contacter en cas d\'accident',
				SHORTTITLE:'Personne CVTI en cas d\'accident',
			},
			TEL_CONTACT_INTERNE_SECOURS:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			CONTACT_CLIENT_CHEF_CHANTIER:{
				LABEL:'Nom Chef de chantier client',
				PLACEHOLDER:'',
				TITLE:'Nom Chef de chantier client',
				SHORTTITLE:'Nom Chef de chantier client',
			},
			TEL_CONTACT_CLIENT_CHEF_CHANTIER:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			CONTACT_CLIENT_HSE:{
				LABEL:'Interlocuteur HSE ou SPS',
				PLACEHOLDER:'',
				TITLE:'Interlocuteur HSE ou SPS',
				SHORTTITLE:'Interlocuteur HSE ou SPS',
			},
			TEL_CONTACT_CLIENT_HSE:{
				LABEL:'Numéro de téléphone',
				PLACEHOLDER:'',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			HORAIRES:{
				LABEL:'Heures de travail du chantier',
				PLACEHOLDER:'',
				TITLE:'Heures de travail du chantier',
				SHORTTITLE:'Heures de travail du chantier',
			},
			COURANT:{
				LABEL:'Courant mis à disposition',
				PLACEHOLDER:'',
				TITLE:'Courant mis à disposition',
				SHORTTITLE:'Courant mis à disposition',
			},
		},
		COMMON:{
			CITY:{
				LABEL:'Ville',
				PLACEHOLDER:'',
				TITLE:'Ville',
				SHORTTITLE:'Ville',
			},
			POSTCODE:{
				LABEL:'Code Postal',
				PLACEHOLDER:'',
				TITLE:'Code Postal',
				SHORTTITLE:'Code Postal',
			},
			COUNTRY:{
				LABEL:'Pays',
				PLACEHOLDER:'',
				TITLE:'Pays',
				SHORTTITLE:'Pays',
			},
			UPDATED_AT:{
				TITLE:'Mise à jour des informations',
				SHORTTITLE:'Mis à jour le'
			},
			CREATED_AT:{
				TITLE:'Créé le',
				SHORTTITLE:'Créé le'
			},
			ARCHIEVED_AT:{
				TITLE:'Archivé le',
				SHORTTITLE:'Archivé le'
			},
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
			CREATION_DATE : "Date de création"
		},
	}
};

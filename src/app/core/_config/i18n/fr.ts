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
			SAVE:'Sauvegarder',
			CANCEL: 'Annuler',
			CLEAR: 'Vider'
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
				ADD:'Nouvelle analyse de risque de chantier',
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
			LIST: 'Liste',
			ADMIN: 'Admin',
			HOME: 'Accueil',
			SUB_ADMIN:{},
			BTN:{
				NEWAR: 'Nouvelle analyse de risque',
				NEWCHANTIER: 'Nouveau chantier'
			}
		},
		AUTH: {
			GENERAL: {
				OR: 'Ou',
				SUBMIT_BUTTON: 'Soumettre',
				NO_ACCOUNT: 'Pas de compte',
				SIGNUP_BUTTON: 'S\'enregistrer',
				FORGOT_BUTTON: 'Mot de passe oublié',
				BACK_BUTTON: 'Retour',
				PRIVACY: 'Privacy',
				LEGAL: 'Legal',
				CONTACT: 'Contact',
			},
			LOGIN: {
				TITLE: 'Accéder à la <b>plateforme</b>',
				BUTTON: 'Se Connecter',
			},
			FORGOT: {
				TITLE: 'Mot de passe oublié ?',
				DESC: 'Entrez votre email pour réinitialiser votre mot de passe',
				SUCCESS: 'Votre mot de passe a bien été réinitialisé.'
			},
			REGISTER: {
				TITLE: 'Créer un compte',
				DESC: 'Enter your details to create your account',
				SUCCESS: 'Your account has been successfuly registered.'
			},
			EDIT: {
				TITLE: 'Merci de modifier votre mot de passe',
				DESC: 'Saisissez un nouveau mot de passe',
				SUCCESS: 'Votre mot de passe a été modifié avec succès.'
			},
			INPUT: {
				EMAIL: 'Email',
				FULLNAME: 'Fullname',
				PASSWORD: 'Mot de passe',
				NEW_PASSWORD: 'Nouveau mot de passe',
				CONFIRM_PASSWORD: 'Confirmation',
				USERNAME: 'Nom d\'utilisateur'
			},
			VALIDATION: {
				INVALID: '{{name}} n\'est pas valide',
				REQUIRED: '{{name}} est requis',
				MIN_LENGTH: '{{name}} doit avoir une longueur minimale de {{min}}',
				AGREEMENT_REQUIRED: 'Vous devez accepter les termes et conditions',
				NOT_FOUND: 'Le {{name}} requis n\'a pas été trouvé',
				INVALID_LOGIN: 'Les informations de connection sont incorrectes',
				REQUIRED_FIELD: 'champ requis',
				MIN_LENGTH_FIELD: 'Longueur du champ minimale:',
				MAX_LENGTH_FIELD: 'Longueur du champ maximale:',
				INVALID_FIELD: 'champ non valide',
				NOT_SAME: 'Les mots de passe doivent correspondre'
			},
			LOGOUT: 'Se déconnecter'
		},
		CHANTIERS:{
			NUMBER:{
				LABEL:'Numéro',
				PLACEHOLDER:'',
				TITLE:'N° du chantier',
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
				LABEL:'Analyses de risque',
				PLACEHOLDER:'',
				TITLE:'Analyses passées',
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
				LABEL:'Visites Sécurité',
				PLACEHOLDER:'',
				TITLE:'Visites passées',
				SHORTTITLE:'Visites passées',
			},
			FORM:{
				CREATE:'Créer un nouveau chantier'
			}
		},
		ARS:{
			CHANTIERS:{
				NUMBER:'Numéro chantier',
				NAME:'Nom du chantier',
				ADRESS:'Adresse',
				DATE_DEMARRAGE:'Date de démarage chantier',
				BUDGET:'Budget chantier',
				EMPLOYEE:'Salarié CVTI réalisant la visite commune',
				FORM:{
					SEARCH:{
						TITLE:'Rechercher un chantier',
						RESULT: {
							TEXT1:'Un chantier trouvé',
							TEXT2:'pour cette analyse de risque'
						}
					},
					DETAIL:{
						TITLE:'Analyse de risque',
						SUBTITLE:'réalisée sur le chantier'
					}

				}
			},
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
			SIGNATURECOUNT:'Signatures',
			OBSERVATION:'Observations',
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
						MSG: 'Si oui renseigner les informations ci-dessous'
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
				REGISTRAR: 'Nom de la personne en charge du registre',
				CVTI_RESPONSIBLE: 'Nom du chargé d’affaire CVTI',
				CA_ASSISTANT: 'Assistant CA'
			},
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
			AS_DAYS:{
				LABEL:'Jours d\'accueil sécurité',
				PLACEHOLDER:'',
				TITLE:'Jours d\'accueil sécurité',
				SHORTTITLE:'Jours d\'accueil sécurité',
			},
			AS_HORAIRES:{
				LABEL:'Horaire d\'accueil sécurité',
				PLACEHOLDER:'',
				TITLE:'Horaire d\'accueil sécurité',
				SHORTTITLE:'Horaire d\'accueil sécurité',
			},
			ASIGNER:{
				LABEL:'À signer',
				PLACEHOLDER:'',
				TITLE:'À signer',
				SHORTTITLE:'À signer',
			},
			QUOTIDIENNEMENT:{
				LABEL:'Quotidiennement',
				PLACEHOLDER:'',
				TITLE:'Quotidiennement',
				SHORTTITLE:'Quotidiennement',
			},
			DEMIJOURNEE:{
				LABEL:'Par 1/2 journée',
				PLACEHOLDER:'',
				TITLE:'Par 1/2 journée',
				SHORTTITLE:'Par 1/2 journée',
			},
			DEUXHEURES:{
				LABEL:'Toute les 2h',
				PLACEHOLDER:'',
				TITLE:'Toute les 2h',
				SHORTTITLE:'Toute les 2h',
			},
			SIGNATAIRECOUNT:{
				LABEL:'Nombre de signataires',
				PLACEHOLDER:'',
				TITLE:'Nombre de signataires',
				SHORTTITLE:'Signataires',
			},
			SIGNATAIRES:{
				LABEL:'Signataires',
				PLACEHOLDER:'',
				TITLE:'Signataires',
				SHORTTITLE:'Signataires',
			}
		},
		VISITES:{
			CODE:{
				LABEL:'Numéro',
				PLACEHOLDER:'',
				TITLE:'Numéro',
				SHORTTITLE:'Numéro'
			},
			CLIENT:{
				LABEL:'Client',
				PLACEHOLDER:'',
				TITLE:'Client',
				SHORTTITLE:'Client'
			},
			CHANTIER:{
				LABEL:'Nom du chantier',
				PLACEHOLDER:'',
				TITLE:'Nom du chantier',
				SHORTTITLE: 'Nom'
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
				TITLE:'Statut de la visite',
				SHORTTITLE:'Statut'
			},
			REDACTEUR:{
				LABEL:'Rédacteur',
				PLACEHOLDER:'',
				TITLE:'Rédacteur',
				SHORTTITLE:'Rédacteur',
			},
			VISITED:{
				LABEL:'Personne visité',
				PLACEHOLDER:'',
				TITLE:'Personne visité',
				SHORTTITLE:'Personne visité',
			},
			DATE_VISITE:{
				LABEL:'Date de la visite',
				PLACEHOLDER:'',
				TITLE:'Date de la visite',
				SHORTTITLE:'Date de visite',
			},
			FORM:{
				CREATE:'Créer une nouvelle visite'
			}
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
				LABEL:'Date de création',
				TITLE:'Date de création',
				SHORTTITLE:'Créé le'
			},
			ARCHIEVED_AT:{
				TITLE:'Archivé le',
				SHORTTITLE:'Archivé le'
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
			FIRSTNAME:{
				LABEL:'Prénom',
				PLACEHOLDER:'',
				TITLE:'Prénom'
			},
			LASTNAME:{
				LABEL:'Nom',
				PLACEHOLDER:'',
				TITLE:'Nom'
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

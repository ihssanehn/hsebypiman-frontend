import { noMonitor } from '@ngrx/store-devtools/src/config';

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
			CLEAR: 'Vider',
			DUPLICATE: 'Dupliquer',
			SIGN: 'Signer'
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
			ENTREPRISES: 'Entreprises',
			SUB_ENTREPRISES:{
				DETAIL:'Détail de l\'entreprise',
				ADD:'Ajouter une entreprise',
				EDIT:'Modifier l\'entreprise',
				LIST:'Liste des entreprises',
			},
			LIST: 'Liste',
			ADMIN: 'Admin',
			HOME: 'Accueil',
			SUB_ADMIN:{},
			BTN:{
				NEWAR: 'Nouvelle analyse de risque',
				NEWCHANTIER: 'Nouveau chantier',
				NEWVS: 'Nouveau visite de sécurité',
				NEWENTREPRISE: 'Nouvelle entreprise',
				NEWACTION: 'Nouvelle Action',
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
				INVALID_LOGIN: 'Les informations de connexion sont incorrectes',
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
				TITLE:'N° du chantier',
				SHORTTITLE:'Numéro'
			},
			CLIENT:{
				LABEL:'Client',
				TITLE:'Client',
				SHORTTITLE:'Client'
			},
			NAME:{
				LABEL:'Nom du chantier',
				TITLE:'Nom du chantier',
				SHORTTITLE: 'Nom'
			},
			ADRESS:{
				LABEL:'Adresse du chantier',
				TITLE:'Adresse du chantier',
				SHORTTITLE: 'Adresse'
			},
			TYPE:{
				LABEL:'Type',
				TITLE:'Type',
				SHORTTITLE:'Type'
			},
			STATUS:{
				LABEL:'Statut',
				TITLE:'Statut actuel du chantier',
				SHORTTITLE:'Statut'
			},
			CONTACT:{
				LABEL:'Contact Client',
				TITLE:'Contact client',
				SHORTTITLE:'Contact',
			},
			DATE_DEMARRAGE:{
				LABEL:'Date de démarage chantier',
				TITLE:'Date de démarage chantier',
				SHORTTITLE:'Date de démarage',
			},
			AR: 'Analyse de risque',
			CHIEF:{
				LABEL:'Chargé d\'affaire',
				TITLE:'Chargé d\'affaire',
				SHORTTITLE:'Nom',
			},
			RESP_CHIFFRAGE:{
				LABEL:'Responsable du chiffrage',
				TITLE:'Responsable du chiffrage',
				SHORTTITLE:'Nom',
			},
			BUDGET:{
				LABEL:'Budget',
				TITLE:'Budget',
				SHORTTITLE:'Montant',
			},
			AR_COUNT:{
				LABEL:'Quantité A.R',
				TITLE:'Quantité A.R',
				SHORTTITLE:'Nombre d\'analyses',
			},
			LASTAR:{
				LABEL:'Dernière A.R',
				TITLE:'Dernière A.R',
				SHORTTITLE:'Dernière A.R',
			},
			AR_INPROGRESS:{
				LABEL:'A.R en cours',
				TITLE:'Analyse de risque en cours',
				SHORTTITLE:'A.R en cours',
			},
			ARS_HISTORY:{
				TITLE:'Historique des Analyses de risque',
				SHORTTITLE:'Historique des A.R',
			},
			ARS:{
				LABEL:'Analyses de risque',
				TITLE:'Analyses passées',
				SHORTTITLE:'Prochaine analyse',
			},
			VS_COUNT:{
				LABEL:'Quantité V.S',
				TITLE:'Quantité V.S',
				SHORTTITLE:'Nombre de visites',
			},
			LAST_VS:{
				LABEL:'Dernière V.S',
				TITLE:'Dernière V.S',
				SHORTTITLE:'Dernière V.S',
			},
			VSS:{
				LABEL:'Visites Sécurité',
				TITLE:'Visites passées',
				SHORTTITLE:'Visites passées',
			},
			EES:{
				LABEL:'Entreprises extérieures',
				TITLE:'Entreprises extérieures',
				SHORTTITLE:'Entreprises extérieures',
			},
			EECOUNT:{
				LABEL:'Nombre d\'E.E',
				TITLE:'Nombre d\'E.E',
				SHORTTITLE:'Nombre d\'entreprises extérieures',
			},
			HABCOUNT:{
				LABEL:'Nombre d\'habilitations',
				TITLE:'Nombre d\'habilitations',
				SHORTTITLE:'Nombre d\'habilitations',
			},
			HABILITATIONS:{
				LABEL:'Habilitations obligatoires pour accéder au chantier',
				TITLE:'Habilitations obligatoires pour accéder au chantier',
				SHORTTITLE:'Habilitations obligatoires',
			},
			EE_PRESENCE:{
				LABEL:'Présence d\'E.E',
				TITLE:'Présence d\'E.E',
				SHORTTITLE:'Présence d\'entreprises extérieures',
			},
			FORM:{
				CREATE:'Créer un nouveau chantier'
			}
		},
		// Entreprises Externes
		EES:{
			RAISON_SOCIALE:{
				LABEL: 'Raison sociale',
				PLACEHOLDER:'Saisir ici...',
				TITLE: 'Raison sociale',
				SHORTTITLE:'Raison sociale',
			},
			TYPE:{
				LABEL: 'Type d\'entreprise',
				PLACEHOLDER:'Saisir ici...',
				TITLE: 'Type d\'entreprise',
				SHORTTITLE:'Type',
			},			
			CA:{
				LABEL: 'Chiffre d\'affaire',
				PLACEHOLDER:'Saisir ici...',
				TITLE: 'Chiffre d\'affaire',
				SHORTTITLE:'CA',
			},
			CHANTIERS:{
				LABEL: 'Chantiers',
				TITLE: 'Chantiers',
				SHORTTITLE:'Chantiers',
			},
			INTERIMAIRE:{
				LABEL: 'Intérimaire',
				TITLE: 'Intérimaire',
				SHORTTITLE:'Intérimaire',
			},
			CHANTIERS_COUNT:{
				LABEL: 'Nombre de chantiers',
				TITLE: 'Nombre de chantiers',
				SHORTTITLE:'Nbr chantiers',
			},
			DATE_DEMARRAGE:{
				LABEL: 'Date de démarrage',
				PLACEHOLDER:'Saisir ici...',
				TITLE: 'Date de démarrage',
				SHORTTITLE:'Date démarrage',
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
						LABEL:'Rechercher un chantier',
						NOTIF: {
							STANDARD: {
								TEXT1:'Un chantier trouvé',
								TEXT2:'pour cette analyse de risque'
							},
							AR_NOT_SIGNED_FOUND: {
								TEXT1:'Il y une autre analyse de risque',
								TEXT2:'pour ce chantier, qui n\'a pas encore été signée'
							},
							AR_NOT_ARCHIVED_FOUND: {
								TEXT1:'Une autre analyse de risque trouvée',
								TEXT2:'pour ce chantier, Elle va être archivée dès que vous en créez une nouvelle'
							}
						},

					},
					DETAIL:{
						TITLE:'Informations chantier',
						SUBTITLE:''
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
					MSG: 'Obligatoirement port des EPI standard chez CVTI : casque, gants, vêtements couvrants, chaussures. Casquette tolérée pour le travail dans les faux plafonds (en fonction PDP du client). Si bruit port du casque antibruit pour les autres risques, adopter l’attitude suivante et cocher les actions à mener :',
					MSGDETAIL: 'Obligatoirement port des EPI standard chez CVTI : casque, gants, vêtements couvrants, chaussures. Casquette tolérée pour le travail dans les faux plafonds (en fonction PDP du client). Si bruit port du casque antibruit pour les autres risques, adopter l’attitude suivante :',
					MSGDETAILNORISK: 'Obligatoirement port des EPI standard chez CVTI : casque, gants, vêtements couvrants, chaussures. Casquette tolérée pour le travail dans les faux plafonds (en fonction PDP du client). Si bruit port du casque antibruit.'
				},
				PARKINGBLOCK:{
					TITLE: 'Zone de stationnement des véhicules pendant le chantier'
				},
				STOCKBLOCK:{
					TITLE: 'Zone de stockage matériel chantier'
				},
				EQBLOCK:{
					TITLE: 'Equipements à prévoir sur le chantier'
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
					TITLE: 'Observation',
					SUBTITLE: 'Observations complémentaires',
					DECLARATION: 'J’ai pris connaissance de l’analyse de risque du chantier, du PPSPS ou du PDP et applique les moyens de préventions nécessaires'
				},
				SIGNATURE_OBSERVATION:{
					TITLE: 'Observation et signatures',
					SUBTITLE: 'Observations complémentaires',
					SHORTTITLE: 'Les signataires'
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
				TITLE:'Date de l\'analyse de risque',
				SHORTTITLE:'Date de l\'analyse de risque',
			},
			PREVOIR_COMPAGNONS:{
				LABEL:'A prévoir pour les compagnons',
				TITLE:'A prévoir pour les compagnons',
				SHORTTITLE:'A prévoir pour les compagnons',
			},
			DATE_ACCUEIL_SECU:{
				LABEL:'Date de l\'accueil sécurité',
				TITLE:'Date de l\'accueil sécurité',
				SHORTTITLE:'Date de l\'accueil sécurité',
			},
			REALISATEUR:{
				LABEL:'Personne en charge de réaliser l\'accueil',
				TITLE:'Personne en charge de réaliser l\'accueil',
				SHORTTITLE:'Personne en charge de réaliser l\'accueil',
			},
			TEL_REALISATEUR:{
				LABEL:'Numéro de téléphone',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			DATE_VALIDITE:{
				LABEL:'Date de validité de l\'accueil sécurité',
				TITLE:'Date de validité de l\'accueil sécurité',
				SHORTTITLE:'Date de validité de l\'accueil sécurité',
			},
			NUM_SECOURS:{
				LABEL:'Numéro en cas d\'accident ou incendie',
				TITLE:'Numéro en cas d\'accident ou incendie',
				SHORTTITLE:'En cas d\'accident ou incendie',
			},
			CONTACT_INTERNE_SECOURS:{
				LABEL:'Personne CVTI',
				TITLE:'Personne CVTI',
				SHORTTITLE:'Personne CVTI en cas d\'accident',
			},
			TEL_CONTACT_INTERNE_SECOURS:{
				LABEL:'Numéro de téléphone',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			CONTACT_CLIENT_CHEF_CHANTIER:{
				LABEL:'Nom Chef de chantier client',
				TITLE:'Nom Chef de chantier client',
				SHORTTITLE:'Nom Chef de chantier client',
			},
			TEL_CONTACT_CLIENT_CHEF_CHANTIER:{
				LABEL:'Numéro de téléphone',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			CONTACT_CLIENT_HSE:{
				LABEL:'Interlocuteur HSE ou SPS',
				TITLE:'Interlocuteur HSE ou SPS',
				SHORTTITLE:'Interlocuteur HSE ou SPS',
			},
			TEL_CONTACT_CLIENT_HSE:{
				LABEL:'Numéro de téléphone',
				TITLE:'Numéro de téléphone',
				SHORTTITLE:'Numéro de téléphone',
			},
			HORAIRES:{
				LABEL:'Heures de travail du chantier',
				TITLE:'Heures de travail du chantier',
				SHORTTITLE:'Heures de travail du chantier',
			},
			COURANT:{
				LABEL:'Courant mis à disposition',
				TITLE:'Courant mis à disposition',
				SHORTTITLE:'Courant mis à disposition',
			},
			AS_DAYS:{
				LABEL:'Jours d\'accueil sécurité',
				TITLE:'Jours d\'accueil sécurité',
				SHORTTITLE:'Jours d\'accueil sécurité',
			},
			AS_HORAIRES:{
				LABEL:'Horaire d\'accueil sécurité',
				TITLE:'Horaire d\'accueil sécurité',
				SHORTTITLE:'Horaire d\'accueil sécurité',
			},
			ASIGNER:{
				LABEL:'À signer',
				TITLE:'À signer',
				SHORTTITLE:'À signer',
			},
			QUOTIDIENNEMENT:{
				LABEL:'Quotidiennement',
				TITLE:'Quotidiennement',
				SHORTTITLE:'Quotidiennement',
			},
			DEMIJOURNEE:{
				LABEL:'Par 1/2 journée',
				TITLE:'Par 1/2 journée',
				SHORTTITLE:'Par 1/2 journée',
			},
			DEUXHEURES:{
				LABEL:'Toute les 2h',
				TITLE:'Toute les 2h',
				SHORTTITLE:'Toute les 2h',
			},
			SIGNATAIRECOUNT:{
				LABEL:'Nombre de signataires',
				TITLE:'Nombre de signataires',
				SHORTTITLE:'Signataires',
			},
			SIGNATAIRES:{
				LABEL:'Signataires (avec / sans)',
				TITLE:'Signataires',
				SHORTTITLE:'Signataires',
			}
		},
		VISITES:{
			CODE:{
				LABEL:'Numéro',
				TITLE:'Numéro',
				SHORTTITLE:'Numéro'
			},
			CLIENT:{
				LABEL:'Client',
				TITLE:'Client',
				SHORTTITLE:'Client'
			},
			CHANTIER:{
				LABEL:'Nom du chantier',
				TITLE:'Nom du chantier',
				SHORTTITLE: 'Nom'
			},
			VEHICULE:{
				LABEL:'Nom de véhicule',
				TITLE:'Nom de véhicule',
				SHORTTITLE: 'Véhicule'
			},
			ENTREPRISE:{
				LABEL:'Entreprise visitée',
				TITLE:'Entreprise visitée',
				SHORTTITLE: 'Nom'
			},
			TYPE:{
				LABEL:'Type',
				TITLE:'Type',
				SHORTTITLE:'Type'
			},
			STATUS:{
				LABEL:'Statut',
				TITLE:'Statut de la visite',
				SHORTTITLE:'Statut'
			},
			REDACTEUR:{
				LABEL:'Rédacteur',
				TITLE:'Rédacteur',
				SHORTTITLE:'Rédacteur',
			},
			VISITED:{
				LABEL:'Personne visitée',
				TITLE:'Personne visitée',
				SHORTTITLE:'Personne visitée',
			},
			DATE_VISITE:{
				LABEL:'Date de la visite',
				TITLE:'Date de la visite',
				SHORTTITLE:'Date de visite',
			},
			FORM:{
				CREATE:'Créer une nouvelle visite'
			},
			KO_SOLVED_COUNT:{
				SHORTTITLE: 'Nbr de NC traitées',
				TITLE: 'Nombre de non conformité traitées'
			},
			KO_UNSOLVED_COUNT:{
				SHORTTITLE: 'Nbr de NC à traiter',
				TITLE: 'Nombre de non conformité à traiter'
			},
			PRESENCE_NC:{
				LABEL:'Présence de non conformité',
				LABEL_COMP:'Présence de non conformité'
			},
			HAS_RECTIF:{
				LABEL:'Rectification immédiate faite',
				LABEL_COMP:'(pas d\'action de CVTI en interne)'
			},
			AVERT:{
				LABEL:'Avertissement',
				LABEL_COMP:'(quand attitude non sécuritaire)'
			},

			ADD_VEHICULE:{
				LABEL:'Numéro d\'identification du véhicule',
				TITLE:'Numéro d\'identification du véhicule',
				SHORTTITLE: 'Numéro d\'identificatio'
			},
			DETAIL_VEHICULE:{
				LABEL:'Numéro d\'identification du véhicule',
				TITLE:'Numéro d\'identification du véhicule',
				SUBTITLE: '',
				SHORTTITLE: 'Numéro d\'identification du véhicule'
			},
			VEHICULE_FOUND:{
				LABEL:'Numéro d\'identification du véhicule saisi',
				TITLE:'Numéro d\'identification du véhicule saisi',
				SHORTTITLE: 'Numéro d\'identification du véhicule saisi'
			},
		},
		EPIS:{
			CODE:{
				TITLE : 'Code',
				SHORTTITLE : 'Code',
				LABEL : 'Code',
			},
			CATEGORIE:{
				TITLE : 'Catégorie',
				SHORTTITLE : 'Catégorie',
				LABEL : 'Catégorie',
			},
		},
		OUTILLAGE : {
			LABEL:{
				TITLE : 'Équipement',
				SHORTTITLE : 'Équipement',
				LABEL : 'Équipement',
			},
			PROPRIETAIRE : {
				TITLE : 'Propriétaire',
				SHORTTITLE : 'Propriétaire',
				LABEL : 'Propriétaire'
			},
			OUTIL : {
				TITLE : "Identification de l'outil",
				LABEL : "Identification de l'outil",
			}
		},
		PLANACTIONS:{
			NUMBER:{
				LABEL:'Numéro',
				TITLE:'N° du plan d\'action',
				SHORTTITLE:'Numéro'
			},
			ORIGINE:{
				LABEL:'Origine',
				TITLE:'Origine',
				SHORTTITLE: 'Origine'
			},
			RISQUE:{
				LABEL:'Risque',
				TITLE:'Risque',
				SHORTTITLE: 'Risque'
			},
			NAME:{
				LABEL:'Actions décidées',
				TITLE:'Actions décidées',
				SHORTTITLE: 'Actions'
			},
			OBJECTIF:{
				LABEL:'Objectif',
				TITLE:'Objectif',
				SHORTTITLE: 'Objectif'
			},
			PILOTE:{
				LABEL:'Pilote',
				TITLE:'Pilote',
				SHORTTITLE: 'Pilote'
			},
			DELAI:{
				LABEL:'Délai',
				TITLE:'Délai',
				SHORTTITLE:'Délai'
			},
			STATUS:{
				LABEL:'Avancement',
				TITLE:'Avancement',
				SHORTTITLE:'Avancement'
			},
			REALISATION:{
				LABEL:'Réalisation',
				TITLE:'Réalisation',
				SHORTTITLE:'Réalisation'
			},
			EFFICACITE:{
				LABEL:'Efficacité',
				TITLE:'Efficacité',
				SHORTTITLE:'Efficacité'
			},
			COMMENT:{
				LABEL:'Commentaires',
				TITLE:'Commentaires',
				SHORTTITLE:'Commentaires'
			},
			FORM:{
				CREATE: 'Créer un nouveau plan d\'action'
			}

		},
		COMMON:{
			ADRESS:{
				LABEL:'Adresse',
				TITLE:'Adresse',
				SHORTTITLE:'Adresse'
			},
			CITY:{
				LABEL:'Ville',
				TITLE:'Ville',
				SHORTTITLE:'Ville',
			},
			POSTCODE:{
				LABEL:'Code Postal',
				TITLE:'Code Postal',
				SHORTTITLE:'Code Postal',
			},
			COUNTRY:{
				LABEL:'Pays',
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
			
			NAME:{
				LABEL:'Nom',
				TITLE:'Nom'
			},
			PHONENUMBER:{
				LABEL:'Numéro de téléphone',
				TITLE:'Numéro de téléphone'
			},
			DATE:{
				LABEL:'Date',
				TITLE:'Date'
			},
			FIRSTNAME:{
				LABEL:'Prénom',
				TITLE:'Prénom'
			},
			LASTNAME:{
				LABEL:'Nom',
				TITLE:'Nom'
			},
			SOCIETE:{
				LABEL:'Société',
				TITLE:'Société'
			},
			SIGNATURE:{
				LABEL:'Signature',
				TITLE:'Signature'
			},
			REMARQUE:{
				LABEL:'Remarques',
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
			SEARCH_OUTILLAGE : "Numéro d'identification de l'outil",
			SEARCH_SALARIE : "Rechercher un salarié",
			ADD_VEHICULE : "Numéro d'identification du véhicule",
		},
	}
};

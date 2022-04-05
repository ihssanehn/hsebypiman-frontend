import { Categorie, Visite } from './';
import {User} from '../auth';

export class Materiel {
    id?: number;
    libelle?: string;
    code?: string;
    numero_serie?: string;
    categorie_id?: number;
    categorie?: Categorie;
    main_categorie_id?: number;
    main_categorie?: Categorie;
    marque?: string;
    description?: string;
    fournisseur?: string;
    date_entree?: Date;
    date_sortie?: Date;
    formation_requise?: boolean;
    habilitation_requise?: boolean;
    has_controle?: boolean;
    frequence_controle?: number;
    is_location?: boolean;
    is_active?:boolean;
    is_stock_commun?:boolean;
    actual_user?:User;
    next_visit?: Date;
    last_visite: Visite;
    visites: Visite[];
    cout?: number;
    date_fin_garantie?: Date;
    creator_id?: number;
    creator: User;

    constructor(categorie_id: number = null, libelle: string = null) {
        this.libelle = libelle;
        this.categorie_id = categorie_id;
    }
}
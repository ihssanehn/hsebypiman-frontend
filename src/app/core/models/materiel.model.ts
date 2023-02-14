import { Categorie, Visite } from './';
import {User} from '../auth';

export class Materiel {
    id?: number;
    libelle?: string;
    numero_serie?: string;
    categorie_id?: number;
    categorie?: Categorie;
    main_categorie_id?: number;
    main_categorie?: Categorie;
    description?: string;
    date_entree?: Date;
    has_controle?: any;
    has_atex?: any;
    actual_user?: User[];
    salaries?: User[];
    stock_disponible?: number;
    date_derniere_revision?: Date;
    date_prochaine_revision: Visite;
    comment_revision?:string;
    documents?: any[];
    flat_categories?: any[];
    revision?:string
    etat?:number;
    creator_id?: number;
    creator: User;

    constructor(categorie_id: number = null, libelle: string = null) {
        this.libelle = libelle;
        this.categorie_id = categorie_id;
    }
}
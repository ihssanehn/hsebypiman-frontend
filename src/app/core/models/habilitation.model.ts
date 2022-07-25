
import {User} from '@app/core/auth'
import { CatHabilitation } from './catHabilitation.model';
import { Formation } from './formation.model';

export class Habilitation {
    id?: number;
    cat_risque?:CatHabilitation;
    categorie?: CatHabilitation;
    formations?: Formation[];
    libelle?:string;
    duree_validite?:number;
    code?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
    created_at?: Date;
    updated_at?: Date;
}
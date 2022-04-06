
import {User} from '@app/core/auth'
import { CatHabilitation } from './catHabilitation.model';

export class Habilitation {
    id?: number;
    cat_risque?:CatHabilitation;
    libelle?:string;
    code?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
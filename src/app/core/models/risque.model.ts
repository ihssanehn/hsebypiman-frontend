
import {User} from '@app/core/auth'
import { CatRisque } from './catRisque.model';

export class Risque {
    id?: number;
    cat_risque_id?: number;
    cat_risque?:CatRisque;
    libelle?:string;
    code?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
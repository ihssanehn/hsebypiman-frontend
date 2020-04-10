
import {User} from '@app/core/auth'
import { Risque } from './risque.model';

export class CatRisque {
    _id?: number;
    libelle?:string;
    code?:string;
    risques?:Array<Risque>;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
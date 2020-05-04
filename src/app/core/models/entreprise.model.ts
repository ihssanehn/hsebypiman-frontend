
import {User} from '@app/core/auth'
import { Chantier } from './chantier.model';
import { Type } from './type.model';

export class Entreprise {
    id?: number;
    raison_sociale?:string;
    type?:Type;
    pivot?:Array<any>;
    creator_id?:number;
    creator?:User;
    chantiers?:Chantier;
}

import {User} from '@app/core/auth'
import { Question } from './question.model';

export class CatQuestion {
    id?: number;
    libelle?:string;
    type_id?:number;
    code?:string;
    questions?:Array<Question>;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
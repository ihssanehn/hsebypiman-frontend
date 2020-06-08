
import {User} from '@app/core/auth'

export class Type {
    id?: number;
    libelle?:string;
    code?:string;
    color?:string;
    model?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
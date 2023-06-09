
import {User} from '@app/core/auth'

export class Status {
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
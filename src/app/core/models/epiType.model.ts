
import {User} from '@app/core/auth'

export class EpiType {
    _id?: number;
    libelle?:string;
    code?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
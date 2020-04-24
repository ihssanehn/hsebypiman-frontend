
import {User} from '@app/core/auth'
import {Type} from '@app/core/models'

export class Zone {
    id?: number;
    libelle?:string;
    code?:string;
    type_id?:number;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
    type?:Type;
}

import {User} from '@app/core/auth'

export class Categorie {
    
    _id?: number;
    parent_id?:number;
    parent?:Categorie;
    children:Array<Categorie>;
    libelle?:string;
    code?:string;
    color?:string;
    model?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
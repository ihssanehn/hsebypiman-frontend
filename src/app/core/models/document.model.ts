
import {User} from '@app/core/auth'

export class Document {
    id?: number;
    documentable_id?:number;
    documentable_type?:string;
    libelle?:string;
    nom_original?:string;
    extension?:string;
    size?:string;
    path?:string;
    canvas?:string;
    categorie_id?:number;
    creator_id?:number;
    creator?:User;
    src?:string;
    image?:string;
    thumbImage?:string;
}
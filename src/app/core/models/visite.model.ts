
import {Ar} from './ar.model'
import { Chantier } from './chantier.model';
import { User } from '../auth';
import { Type } from './type.model';
import { Status } from './status.model';

export class Visite {
    id?:Number;
    code?:String;
    chantier_id?:Number;
    salarie_id?:Number;
    sous_traitant_id?:Number;
    societe_ee?:String;
    redacteur_id?:Number;
    date_visite?:Date;
    is_validated_redacteur?:boolean;
    is_validated_visite?:boolean;
    validated_redacteur_at?:Date;
    validated_visite_at?:Date;
    presence_non_conformite?:boolean;
    has_rectification_imm?:boolean;
    avertissement?:boolean;
    type_id?:Number;
    status_id?:Number;
    creator_id?:Number;
    chantier?:Chantier;
    salarie?:User;
    sous_traitant?:any;
    redacteur?:User;
    type?:Type;
    status?:Status;
    creator?:User;
}
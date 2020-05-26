
import {Ar, Chantier, Type, Status, Question, Signature } from './'
import { User } from '../auth';

export class Visite {
    id?:Number;
    code?:String;
    chantier_id?:Number;
    salarie_id?:Number;
    entreprise_id?:Number;
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
    entreprise?:any;
    redacteur?:User;
    type?:Type;
    status?:Status;
    creator?:User;
    questions?:Array<Question>;
    signatureRedacteur?:Signature;
    signatureVisite?:Signature;
    signatureRespHse?:Signature;
}
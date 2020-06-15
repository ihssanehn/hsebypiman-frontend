
import {Ar, Chantier, Type, Status, Question, Signature, Epi, Outillage, Vehicule, CatQuestion } from './'
import { User } from '../auth';

export class VisiteChantier {
    id?:Number;
    code?:String;
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
    chantier_id?:Number;
    chantier?:Chantier;
    visitable?:any;
    salarie?:User;
    entreprise?:any;
    redacteur?:User;
    type?:Type;
    status?:Status;
    creator?:User;
    questions?:Array<Question>;
    catQuestionsList?:Array<CatQuestion>;
    signatureRedacteur?:Signature;
    signatureVisite?:Signature;
    signatureRespHse?:Signature;
}
export class VisiteEpi {
    id?:Number;
    code?:String;
    salarie_id?:Number;
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
    epi_id?:Number;
    epi?:Epi;
    salarie?:User;
    redacteur?:User;
    status?:Status;
    creator?:User;
    questions?:Array<Question>;
    signatureRedacteur?:Signature;
    signatureVisite?:Signature;
    signatureRespHse?:Signature;
	catQuestionsList: any;
}
export class VisiteOutillage {
    id?:Number;
    code?:String;
    salarie_id?:Number;
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
    outillage_code?:String;
    outillage?:Outillage;
    salarie?:User;
    redacteur?:User;
    type?:Type;
    status?:Status;
    creator?:User;
    questions?:Array<Question>;
    signatureRedacteur?:Signature;
    signatureVisite?:Signature;
    signatureRespHse?:Signature;
	catQuestionsList: CatQuestion[];
}
export class VisiteVehicule {
    id?:Number;
    code?:String;
    salarie_id?:Number;
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
    outillage_id?:Number;
    vehicule?:String;
    salarie?:User;
    redacteur?:User;
    type?:Type;
    status?:Status;
    creator?:User;
    questions?:Array<Question>;
    catQuestionsList?:Array<CatQuestion>;
    signatureRedacteur?:Signature;
    signatureVisite?:Signature;
    signatureRespHse?:Signature;
    img_canvas?: string;
}

export class Visite {
    id?:Number;
    code?:String;
}
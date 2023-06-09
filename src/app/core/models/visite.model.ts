
import { Chantier, Type, Status, Etat, Question, Signature, Materiel, Outillage, Vehicule, CatQuestion, Document } from './'
import { User } from '../auth';

export class VisiteChantier {
    id?:Number;
    code?:String;
    salarie_id?:Number;
    entreprise_id?:Number;
    interimaire_id?:Number;
    nom_prenom?:Number;
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
    visitable_id?:Number;
    visitable_type?:string;
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
    etat_id?:Number;
    etat?:Etat;
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
    materiel_id?:Number;
    visitable_id?:Number;
    visitable_type?:string;
    epi?:Materiel;
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
    etat_id?:Number;
    etat?:Etat;
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
    materiel_id?:Number;
    visitable_id?:Number;
    visitable_type?:string;
    outillage_code?:String;
    materiel?:Outillage;
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
    etat_id?:Number;
    etat?:Etat;
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
    materiel_id?:Number;
    visitable_id?:Number;
    visitable_type?:string;
    materiel?:Vehicule;
    vehicule_code?:String;
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
    photos?: Array<Document>
    vehicule_km?: Number;
}

export class Visite {
    id?:Number;
    code?:String;
    salarie_id?:Number;
    entreprise_id?:Number;
    redacteur_id?:Number;
    date_visite?:Date;
    etat_id?:Number;
    etat?:Etat;
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
    visitable?:any;
    visitable_id?:Number;
    visitable_type?:string;
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
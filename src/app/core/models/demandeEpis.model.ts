
import {User} from '@app/core/auth'
import { Status } from './status.model';

export class DemandeEpis {
    id?: number;
    delivery_type?: number;
    delivery_societe_nom?: string;
    delivery_attention?: string;
    delivery_nom?: string;
    delivery_prenom?: string;
    delivery_numero?: string;
    delivery_rue?: string;
    delivery_cp?: string;
    delivery_ville?: string;
    delivery_pays?: string;
    bu_id?: number;
    bu_autre?: string;
    bu?: any;
    creator_id?:number;
    statut_id?:number;
    creator?:User;
    status?:Status;
    comments?:Comment[];
    epis?:Array<any>;
}
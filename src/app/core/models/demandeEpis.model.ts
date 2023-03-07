
import {User} from '@app/core/auth'
import { Status } from './status.model';

export class DemandeEpis {
    id?: number;
    creator_id?:number;
    statut_id?:number;
    creator?:User;
    status?:Status;
    epis?:Array<any>;
}
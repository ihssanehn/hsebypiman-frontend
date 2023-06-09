import { Status } from './';
import { User } from '../auth';

export class Action {
    id?: number;
    actionable_id?: number;
    actionable_type?: string;
    actionable?:any;
    type_id?: number;
    risque?: string;
    libelle?: string;
    objectif?: string;
    actor_id?: number;
    actor?: User;
    pilote_id?: number;
    pilote?: User;
    delai?: Date;
    status_id?: number;
    status?: Status;
    date_realisation?: Date;
    efficacite?: string;
    commentaires?: string;
    creator_id?: number;
    creator?: User;
    created_at?: Date;
    updated_at?: Date;
}
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
    pilote_id?: number;
    pilote?: User;
    delai?: Date;
    status_id?: number;
    status?: Status;
    realisation?: Date;
    efficacite?: string;
    commentaires?: string;
    creator_id?: number;
    creator?: User;
    created_at?: Date;
    updated_at?: Date;
}
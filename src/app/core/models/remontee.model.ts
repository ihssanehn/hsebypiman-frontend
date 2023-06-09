
import {User} from '@app/core/auth'
import { Action, Type, Document, Comment } from './';

export class Remontee {
    id?: number;
    description: string;
    type?:Type;
    documents?:Document[];
    photos?: Document[];
    comments?:Comment[];
    creator_id?:number;
    creator?:User;
    action?:Action;
    event_date?: Date;
    event_place?: string;
    event_location_type?: Type;
    event_type?: Type;
    facts?: string;
    actions?: string;
    created_at?: Date;
    is_approved: boolean;
    is_victims?: boolean;
}

import {User} from '@app/core/auth'
import { Type, Document, Comment } from './';

export class Remontee {
    id?: number;
    description: string;
    type?:Type;
    documents?:Document[];
    comments?:Comment[];
    creator_id?:number;
    creator?:User;
}
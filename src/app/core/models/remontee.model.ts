
import {User} from '@app/core/auth'
import { Type, Document } from './';

export class Remontee {
    id?: number;
    description: string;
    type?:Type;
    documents?:Document[];
    creator_id?:number;
    creator?:User;
}
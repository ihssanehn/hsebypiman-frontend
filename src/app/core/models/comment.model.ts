
import {User} from '@app/core/auth'

export class Comment {
    
    id?: number;
    commentable_id?: number;
    commentable_type: string;
    commented_id?: number;
    commented?: User;
    comment?: string;
    created_at?: Date;
    updated_at?: Date;
    creator_id?: number;
    creator?:User;
}
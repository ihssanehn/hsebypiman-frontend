
import {User} from '@app/core/auth'

export class Signature {
    
    id?: number;
    date?: Date;
    signable_id?: number;
    signable_type: string;
    personnel_id?: number;
    commentaires?: string;
    society?: string;
    signature?: string;
    salarie?:User;
    creator_id?: number;
    creator?:User;
}
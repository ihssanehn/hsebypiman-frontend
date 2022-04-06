
import {User} from '@app/core/auth'
import { Entreprise } from './entreprise.model';

export class Signature {
    
    id?: number;
    date?: Date;
    signable_id?: number;
    signable_type: string;
    personnel_id?: number;
    signataire_fullname?: string;
    commentaires?: string;
    entreprise?: Entreprise;
    signature?: string;
    salarie?:User;
    creator_id?: number;
    creator?:User;
}
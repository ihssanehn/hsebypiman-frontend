
import {User} from '@app/core/auth'
import { Document } from './';

export class Causerie {
    id?: number;
    libelle?:string;
    sujet?:string;
    date: Date;
    lieu: string;
    description?: string;
    organisateur_id: number;
    organisateur: User;
    creator_id?: number;
    creator?: User;
    created_at: Date;
    updated_at: Date;
    participants?: Array<any>;
    participants_count?: number;
    docs?: Document[];
    images?: Document[];
    documents?: Document[];}
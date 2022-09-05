
import {User} from '@app/core/auth'
import { Chantier } from './chantier.model';
import { Type } from './type.model';

export class Causerie {
    id?: number;
    libelle?:string;
    sujet?:string;
    date: Date;
    lieu: string;
    organisateur_id: number;
    organisateur: User;
    created_at: Date;
    updated_at: Date;
    participants?: Array<any>;
    participants_count?: number;
}
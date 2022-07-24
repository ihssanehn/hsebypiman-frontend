import {User} from '../auth';
import { Habilitation } from './habilitation.model';

export class Formation {
    id?: number;
    libelle?: string;
    description?: string;
    organisme_formation?: string;
    to_habilitation?: boolean;
    habilitation_id?: number;
    habilitation?: Habilitation;
    pivot?: any;
    creator_id?: number;
    creator: User;
    created_at?: Date;
    updated_at?: Date;
}
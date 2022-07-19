import {User} from '../auth';

export class Formation {
    id?: number;
    libelle?: string;
    description?: string;
    organisme_formation?: string;
    date_debut?: Date;
    date_fin?: Date;
    date_renouvellement?: Date;
    to_habilitation?: boolean;
    habilitation_id?: number;
    habilitation?: any;
    creator_id?: number;
    creator: User;
    created_at?: Date;
    updated_at?: Date;
}
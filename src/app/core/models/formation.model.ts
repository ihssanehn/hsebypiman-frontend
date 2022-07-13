import {User} from '../auth';

export class Formation {
    id?: number;
    libelle?: string;
    description?: string;
    organisme_formation?: string;
    date_debut?: Date;
    date_fin?: Date;
    to_habilitation?: boolean;
    creator_id?: number;
    creator: User;
}
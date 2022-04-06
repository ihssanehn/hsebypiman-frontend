
import {User} from '@app/core/auth'

export class Param {
    _id?: number;
    libelle?: string;
    code?: string;
    value?: string;
    default_value?: string;
    order?: number;
    model?: string;
    is_active?: boolean;
    only_admin?: boolean;
    creator_id?:number;
    creator?:User;
}
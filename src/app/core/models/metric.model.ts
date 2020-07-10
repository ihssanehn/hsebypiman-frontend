
import {User} from '@app/core/auth'
import { CatMetric } from './catMetric.model';

export class Metric {
    id?: number;
    cat_id?:number;
    cat_metric?:CatMetric;
    libelle?:string;
    short_libelle?:string;
    rating?: number;
    year_goal?: any;
    unit?:string;
    is_bool?: boolean;
    is_editable?: boolean;
    code?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
    pivot?:any;
}
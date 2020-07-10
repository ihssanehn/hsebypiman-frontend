
import {User} from '@app/core/auth'
import { Metric } from './metric.model';

export class CatMetric {
    id?: number;
    libelle?:string;
    description?:string;
    type_id?:number;
    code?:string;
    metrics?:Array<Metric>;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
}
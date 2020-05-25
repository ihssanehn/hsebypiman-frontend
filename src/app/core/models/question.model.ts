
import {User} from '@app/core/auth'
import { CatQuestion } from './catQuestion.model';

export class Question {
    id?: number;
    cat_question_id?:number;
    cat_question?:CatQuestion;
    libelle?:string;
    code?:string;
    ordre?:number;
    active?:boolean;
    creator_id?:number;
    creator?:User;
    pivot?:any;
}
import { User } from "../auth";


export class QcmSession {
    id?: number;
    user_id?: number;
    qcm_id?: number;
    score?: number;
    question_count?: number;
    is_success?: boolean;
    user?: User;
    qcm?: any;
    answers?: any;
    creator_id?: number;
    creator?: User;
    created_at?: Date;
    updated_at?: Date;
}
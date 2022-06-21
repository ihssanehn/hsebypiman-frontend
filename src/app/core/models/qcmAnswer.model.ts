import { User } from "../auth";
import { QcmSession } from "./qcmSession.model";


export class QcmAnswer {
    id?: number;
    qcm_session_id?: number;
    response_id?: number;
    qcm_session?: QcmSession;
    response?: any;
    creator_id?: number;
    creator?: User;
    created_at?: Date;
    updated_at?: Date;
}
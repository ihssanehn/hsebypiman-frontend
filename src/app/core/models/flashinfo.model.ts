
import {User} from '@app/core/auth'

export class FlashInfo {
    id?: number;
    title?:string;
    content?:string;
    is_visible?:boolean;
    on_top?:boolean;
    creator_id?:number;
    creator?:User;
    created_at?:Date;

}
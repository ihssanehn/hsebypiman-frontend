export class JsonResponse<T>{
    message : {
        code:string,
        content:string,
    };
    result : {
        data?: T;
        access_token?:string 
    };
    code : number;
    execution_time : number;
}

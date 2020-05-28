export class JsonResponse<T>{
    message : {
        code:string,
        content:string,
    };
    result : {
        data?: T;
    };
    code : number;
    execution_time : number;
}

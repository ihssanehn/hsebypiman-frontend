export class Paginate<T>{
    current_page : number;
    data : Array<T>;
    first_page_url : string;
    from : number;
    last_page : number;
    next_page_url : string;
    path : string;
    per_page:number;
    prev_page_url :string;
    to : number;
    total : number;
}

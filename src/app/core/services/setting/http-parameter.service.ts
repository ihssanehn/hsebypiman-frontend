import { ParameterService } from './parameter.service';
import { HttpService } from '../http-service';
import { Parameter } from '@app/core/models/parameter.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Option } from '@app/core/models/option.model';

export class HttpParameterService extends HttpService implements ParameterService {

    constructor(private http: HttpClient) { 
        super();
    }
    
    get() {
        return this.http.get<Parameter[]>(`${this.baseUrl}parameters`)
            .toPromise();
    }    
    
    createOption(option: Option) {
        return this.http.post<Parameter[]>(`${this.baseUrl}options`, option)
            .toPromise();
    }

    updateOption(option: Option) {
        return this.http.put<Parameter[]>(`${this.baseUrl}options/${option._id}`, {...option})
            .toPromise();
    }

    deleteOption(id: number) {
        return this.http.delete<Parameter[]>(`${this.baseUrl}options/${id}`)
            .pipe(map(result => true))
            .toPromise();
    }

}
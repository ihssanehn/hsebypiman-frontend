import { environment } from '@env/environment';

export abstract class HttpService {
    protected baseUrl = environment.apiBaseUrl;
}
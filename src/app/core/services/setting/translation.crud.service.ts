import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class TranslationCrudService extends HttpService {

  constructor(private http: HttpClient) { 
    super();
  }

  get(lang: string = "en") {
    return this.http.get<any>(`${this.baseUrl}translations?language=${lang}`)
      .toPromise();
  }

  update(translation: any) {
    let language = translation.language;
    
    return this.http.put<any>(`${this.baseUrl}translations/${language}`, {
      group: translation.group,
      key: translation.key,
      value: translation.value
    })
      .toPromise();
  }

  getLanguages() {
    return this.http.get<any>(`${this.baseUrl}languages`)
      .toPromise();
  }
}

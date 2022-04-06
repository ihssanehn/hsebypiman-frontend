import {Injectable} from '@angular/core';


@Injectable()
export class JwtService {

  /**
   * GET TOKEN FROM LOCAL STORAGE
   */
  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  /**
   * SAVE TOKEN IN LOCAL STORAGE
   * @param token -
   */
  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }

  /**
   * REMOVE TOKEN FROM LOCAL STORAGE
   */
  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

}

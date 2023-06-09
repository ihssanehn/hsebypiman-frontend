
import { environment } from '@env/environment';
import { HttpService } from '@app/core/services/http-service';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';


export class RoleService extends HttpService{

  baseUrl = environment.apiBaseUrl+'roles';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    super()
  }

  getList(){
    return this.http.get<any>(this.baseUrl+"/mini");
  }

  getAll(params = {}){
		return this.http.post<any>(this.baseUrl, {...params});
  }

  // getAllFromType(params = {}){
	// 	return this.http.post<JsonResponse<User[]>>(this.baseUrl, {...params});
  // }

  // getUserById(userId: number){
	// 	return this.http.get<JsonResponse<User>>(this.baseUrl + `/${userId}`)
  // }
  
	// deleteUser(userId: number) {
	// 	const url = `${this.baseUrl}/${userId}`;
	// 	return this.http.delete(url);
	// }

	// updateUser(_user: User){
  //   console.log(_user);
	// 	return this.http.put<any>(`${this.baseUrl}/` + _user.id, _user);
	// }

	// createUser(user: User){
	// 	return this.http.post<JsonResponse<User>>(`${this.baseUrl}/create`, user);
  // }
  




}

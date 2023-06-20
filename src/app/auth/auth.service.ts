import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './auth.model';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Content-Type': 'application/json; charset=utf-8',
    withCredentials: 'true',
    
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }


  login(login: any) {
    return this.http
      .post(`${environment.baseApiUrl}Auth/login`, login, httpOptions)
      .pipe(
              map((user:any) => {
                user["username"]=login.userName;
                // store user details and jwt token in local/session storage to keep user logged in between page refreshes
                sessionStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user as any);
                return user;
              })
            );
  }

  logOut() {
    // remove user from local/session storage and set current user to null
    sessionStorage.removeItem('user');
    this.userSubject.next(null!);
    this.router.navigate(['/auth']);
  }

  
//   refreshToken() {
//     return this.http.post<any>(`${environment.baseApiUrl}/users/refresh-token`, {}, { withCredentials: true })
//         .pipe(map((user) => {
//             this.userSubject.next(user);
//             this.startRefreshTokenTimer();
//             return user;
//         }));
// }

}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoading = false;
  isLogin: boolean;
  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    // whether the user is authenticated or not depends whether the token is valid or not;
    // user.token is a string, !user.token returns valid or not, !!user.token converts to a boolean;
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private router: Router,
              private loadingController: LoadingController,
              private http: HttpClient,
              private alertCtrl: AlertController) { }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController.create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.login(email, password);
        } else {
          authObs = this.signup(email, password);
        }
        authObs.subscribe(resData => {
          console.log(resData);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/home');
        },
        errorResponse => {
          loadingEl.dismiss();
          const code = errorResponse.error.error.message;
          let message = 'Could not sign you up, please try again.';
          if (code === 'EMAIL_EXISTS') {
            message = 'This email address already exists';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'Email address could not be found';
          } else if (code === 'INVALID_PASSWORD') {
            message = 'This password is not correct';
          }
          this.showAlert(message);
        }
        );
      });
  }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {token: string; tokenExpirationDate: string; userId: string; email: string};
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
        return user;
    }),
      tap(user => {
        if (user) {
          this._user.next(user);
          // this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }


  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authenticatoin failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
    // tslint:disable-next-line: object-literal-shorthand
    { email: email, password: password, returnSecureToken: true }
    )
    .pipe(tap(this.setUserData.bind(this)));
}

  login(email: string, password: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
    // tslint:disable-next-line: object-literal-shorthand
    { email: email, password: password, returnSecureToken: true }
    )
    .pipe(tap(this.setUserData.bind(this)));
  }


private setUserData(userData: AuthResponseData) {
  const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
  const user = new User(
    userData.localId,
    userData.email,
    userData.idToken,
    expirationTime,
);
  this._user.next(user);
  // this.autoLogout(user.tokenDuration);
  this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
}

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email});
    Plugins.Storage.set({key: 'authData', value: data});
  }

  logout() {
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
    this.router.navigateByUrl('/auth');
  }
}

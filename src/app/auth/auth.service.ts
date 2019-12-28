import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
  // tslint:disable-next-line: variable-name
  private _userIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor(private router: Router,
              private loadingController: LoadingController,
              private http: HttpClient,
              private alertCtrl: AlertController) { }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this._userIsAuthenticated = true;
    this.loadingController.create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingEl => {
        loadingEl.present();
        this.signup(email, password)
        .subscribe(resData => {
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
          }
          this.showAlert(message)
        }
        );
      });
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
    );
    // .pipe(tap(this.setUserData.bind(this)));
}

// private setUserData(userData: AuthResponseData) {
//   const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
//   const user = new User(
//     userData.localId,
//     userData.email,
//     userData.idToken,
//     expirationTime,
// )
//   this._user.next(user);
//   this.autoLogout(user.tokenDuration);
//   this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
// }

  logout() {
    this._userIsAuthenticated = false;
    this.router.navigateByUrl('/auth');
  }
}

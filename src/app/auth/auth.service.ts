import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  login() {
    this.isLoading = true;
    this._userIsAuthenticated = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigateByUrl('/home');
    }, 500);
  }

  logout() {
    this._userIsAuthenticated = false;
    this.router.navigateByUrl('/auth');
  }
}

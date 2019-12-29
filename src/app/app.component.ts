import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  appSubscription: Subscription;
  private previousAuthState = false;

  constructor(public authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.appSubscription = this.authService.userIsAuthenticated
        .subscribe(isAuthenticated => {
          if (!isAuthenticated && this.previousAuthState !== isAuthenticated) {
              this.router.navigateByUrl('/auth');
              this.isLoggedIn = false;
          } else if (isAuthenticated) {
              this.isLoggedIn = true;
          }
          this.previousAuthState = isAuthenticated;
        });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.appSubscription) {
      this.appSubscription.unsubscribe();
    }
  }
}

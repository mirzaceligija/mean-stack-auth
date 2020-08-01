import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
  }

  onSignOut(){
    this.authService.signout();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}

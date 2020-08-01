import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthData } from 'src/app/shared/models/auth-data.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  public user: AuthData;
  isLoading = false;

  private userId: string;
  
  constructor(private authService: AuthService){}

  ngOnInit() {

    this.userId = this.authService.getUserId();

    this.authService.getUserById(this.userId).subscribe(
      userData => {
        this.user = userData.user;
      }
    );
  }
}

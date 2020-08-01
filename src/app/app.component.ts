import { Component } from '@angular/core';
import { AuthService } from './core/authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

}

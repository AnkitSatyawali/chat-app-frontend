import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-app';
  constructor(private router : Router,private authService : AuthService){
  	// if(this.authService.getId())
  	// 	this.router.navigate(['/chats']);
  }

}

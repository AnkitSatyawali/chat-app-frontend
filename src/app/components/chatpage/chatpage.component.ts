import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit {

show=false;
  constructor(private userService : UserService,private authService : AuthService) { }
 
  ngOnInit() {
  	this.authService.isUserLoggedIn('/chats');
  	this.userService.userInfo.subscribe(user => {
  		if(user)
  			this.show = true;
  		else
  			this.show = false;
  	}) 
  }
 
}

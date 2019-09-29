import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  	this.authService.isUserLoggedIn('/chats');
  }

}

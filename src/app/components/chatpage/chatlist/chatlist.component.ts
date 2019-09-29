import { Component, OnInit , OnDestroy} from '@angular/core';
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import API_URL from '../../../config/API_URL';
@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit {
user;
roomName;
message="";
show=false;
id;
messageArray;
  constructor(private authService:AuthService,private userService:UserService,private chatService : ChatService) { }

  ngOnInit() {
    console.log(moment().format('LLL'));
  	this.userService.userInfo.subscribe(user => {
        this.user= user;
        if(this.user.image.slice(0,5)!='https')
        this.user.image = API_URL +this.user.image;
        this.userService.emitnoti(user);
        this.messageArray = new Array();
        console.log(user);
        if(user)
        	this.show=true;
      });
    this.authService.getId().subscribe(data => {
      this.id = data;
    })
    this.userService.RoomName.subscribe(name => {
        this.roomName= name;
        this.chatService.updateMessage(name);
          this.chatService.getMessages(this.roomName).subscribe(message => {
       let i;
       console.log(message);
       for(i=0;i<message.data.length;i++){
         this.messageArray.push(message.data[i]);
       }
       console.log(this.messageArray);
       },err =>{
         console.log(err);
       });
        this.chatService.joinRoom(this.roomName,this.user.name);
        console.log(name);
      });
   
    this.chatService.newMessageReceived()
        .subscribe(data=>{
          console.log(data);
          if(data.sender === this.user.id){
          this.messageArray.push(data);
          console.log(this.messageArray);
          this.chatService.updateMessage(data.roomName);}
      }); 
    
  }
  send(message : string)
  {
  	console.log(message);
  	this.message = ""; 
    const data = {
      roomName: this.roomName,
      message : message,
      sender : this.id.name,
      receiver : this.user.id,
      time : moment().format('LLL') 
    }
    this.chatService.sendMessage(data);
    this.messageArray.push(data);
  }
 // ngOnDestroy() {
 //    const data = {
 //      roomName : this.roomName,
 //      name : this.user.name
 //    }
 //    this.chatService.leaveRoom(data);
 // }
}

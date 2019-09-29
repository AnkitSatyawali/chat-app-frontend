import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ChatService } from '../../../services/chat.service';
import API_URL from '../../../config/API_URL';
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
users;
searchText;
tempusers;
rooms;
noti=[];
inde;
id;
active;

  constructor(private authService : AuthService,private userService : UserService,private chatService : ChatService) { }
 
  ngOnInit() {
  	// this.authService.getAllUsers().subscribe(data =>{
  	// 	this.users = data;
  	// },err =>{
  	// 	console.log(err);
  	// });
    this.userService.notification.subscribe(data =>{
      console.log(data);
      this.active = data;
    })
      this.authService.getId().subscribe(data => {
      this.id = data;
    })
    this.authService.getFriends().subscribe(data =>{
      console.log(data);
      this.users = data.friends;
      this.rooms = data.rooms;
      this.tempusers = data.friends;
      let i;
      console.log(this.users);
      console.log(this.rooms);
      for(i=0;i<this.users.length;i++)
      {
        if(this.users[i].image.slice(0,5)!='https')
        this.users[i].image = API_URL +this.users[i].image;
      }
      for(i=0;i<this.rooms.length;i++)
      {
        this.chatService.joinRoom(this.rooms[i],this.users[i].name);
      }
      for(i=0;i<this.rooms.length;i++)
      {
        this.noti[i]=false;
      }
      for(i=0;i<this.rooms.length;i++)
      {
        const j=i;
        this.chatService.getMessages(this.rooms[i]).subscribe(messages => {
          let val = (messages.data[messages.data.length-1])
          console.log(val);
          if(val && val.status === "Notseen" && this.id.name === val.receiver)
          {this.noti[j] = true;console.log("pop")}
          console.log(this.noti[j]);
        })
      }
    },err =>{
      console.log(err);
    })
    this.userService.added.subscribe(user => {
      this.users.push(user);
    })
    this.chatService.newMessageReceived()
        .subscribe(data=>{
          console.log(data);
          let i;
          for(i=0;i<this.rooms.length;i++)
          {
            if(data.roomName === this.rooms[i])
           {  this.inde = i;console.log(i);}
          }
          if(this.active){
          if(data.sender !== this.id.name && data.sender !== this.active.id)
          {this.noti[this.inde] = true;
          }}
          else
          {
            if(data.sender !== this.id.name)
          {this.noti[this.inde] = true;
          }
          }
          console.log(this.noti);
      });
  }

  userSelected(user,i){
    console.log(user);
    this.noti[i]=false;
    this.authService.getRoomName(user.id).subscribe(name => {
        console.log(name.data._id);
        this.userService.emitname(name.data._id);
    },err => {
      console.log(err);
    });
  	this.userService.emit(user);
  }
  filt()
  {
    this.users = this.tempusers.filter(data =>data['name'].match(this.searchText));
    console.log(this.searchText);
  }

}
 
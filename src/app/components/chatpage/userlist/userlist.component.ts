import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ChatService } from '../../../services/chat.service';
import { DeleteComponent } from '../../delete/delete.component';
import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { environment } from '../../../../environments/environment';
import API_URL from '../../../config/API_URL';
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
ld=true;
users;
searchText;
tempusers;
rooms;
noti=[];
inde;
id;
puser;
active;
flag=false;
activeArray = [];
uniquename=-1;
uniqueactive=-1;
savedNotification;
  constructor(private cookieService:CookieService,public dialog: MatDialog,private authService : AuthService,private userService : UserService,private chatService : ChatService) { }
 
  ngOnInit() {
  	// this.authService.getAllUsers().subscribe(data =>{
  	// 	this.users = data;
  	// },err =>{
  	// 	console.log(err);
  	// });
    this.userService.notification.subscribe(data =>{
      // console.log(data);

      this.active = data;
      this.noti[this.uniqueactive]=false;
      this.flag = true;
    })
      this.authService.getId().subscribe(data => {
      this.id = data;
      console.log(this.id);
    })
    this.authService.getFriends().subscribe(data =>{
      // console.log(data);
      this.users = data.friends;
      this.rooms = data.rooms;
      this.tempusers = data.friends;
      this.savedNotification = data.roomNotification;
      let i;
      if(this.users.length>0)
        this.flag=true;
      // console.log(this.users);
      // console.log(this.rooms);
      // console.log(this.savedNotification);
      for(i=0;i<this.users.length;i++)
      {
        this.activeArray[i]=false;
        if(this.users[i].image.slice(0,5)!='https')
        this.users[i].image = API_URL +this.users[i].image;
      }
      for(i=0;i<this.rooms.length;i++)
      {
        this.chatService.joinRoom(this.rooms[i],this.users[i].name);
        // const salt = bcrypt.genSaltSync(10);
        // console.log(typeof(this.rooms[i]));
        // let key = CryptoJS.AES.encrypt(this.rooms[i],'Hello');
        // // let key = bcrypt.hashSync(this.rooms[i]+environment.appName);
        // this.cookieService.set(this.rooms[i],key);
      }
      for(i=0;i<this.rooms.length;i++)
      {
        if(this.savedNotification[i].updatedBy!=this.id.name && this.savedNotification[i].state==1)
        this.noti[i]=true;
        else 
        this.noti[i]=false;
      }
      this.ld=false;
      // for(i=0;i<this.rooms.length;i++)                             
      // {
      //   const j=i;
      //   this.chatService.getMessages(this.rooms[i]).subscribe(messages => {
      //     let val = (messages.data[messages.data.length-1])
      //     console.log(val);
      //     if(val && val.status === "Notseen" && this.id.name === val.receiver)
      //     {this.noti[j] = true;console.log("pop")}
      //     console.log(this.noti[j]);
      //   })
      // }
    },err =>{
      console.log(err);
    })
    this.userService.added.subscribe(user => {
      // console.log(user);
      this.puser = user;
      // if(this.puser.image.slice(0,5)!='https')
      //   this.puser.image = API_URL +this.puser.image;
      this.users.unshift(user);      
      let i;
      // console.log(this.users);
      this.activeArray.unshift(true);
      this.noti.unshift(false);
      if(this.uniqueactive!=-1)
      this.activeArray[this.uniqueactive+1]=false;
      this.uniqueactive=0;
    })
    this.userService.RoomName2.subscribe(name => { 
      this.rooms.unshift(name);
      // const salt = bcrypt.genSaltSync(10);
      //   let key = bcrypt.hashSync(name+environment.appName, salt);
      //   this.cookieService.set(name,key);
      // console.log(this.rooms);
    }) 
    this.userService.savedNotify.subscribe(data => { 
      this.savedNotification.unshift(data); 
      // console.log(this.savedNotification);
    })
    this.userService.movedTop.subscribe((user:any) => {
      // let index = this.users.index(user);
      // console.log("yo");
      // console.log(user); 
      let temp = user;
      var index = this.users.findIndex(item => item.id == temp.id);
      if(index!=0)
      {this.users.splice(0,0,this.users.splice(index,1)[0]);
        this.rooms.splice(0,0,this.rooms.splice(index,1)[0]);
        this.savedNotification.splice(0,0,this.savedNotification.splice(index,1)[0]);
        this.noti.splice(0,0,this.noti.splice(index,0)[0]);
        this.activeArray[0]=true;
        // console.log(this.rooms);
        this.activeArray[this.uniqueactive]=false;this.uniqueactive=0;
      }
    })
    this.authService.userAddedSuccessfully().subscribe(data => {
      //  this.users.push(data);
      // console.log(data);
    })
    this.chatService.newMessageReceived()
        .subscribe(data=>{
          // console.log(data);
          let i;
          // console.log(this.rooms);
          var index = this.rooms.findIndex(item => item == data.roomName);
          // for(i=0;i<this.rooms.length;i++)
          // {
          //   if(data.roomName === this.rooms[i])
          //  {  this.inde = i;console.log(i);}
          // }
          // console.log(index);
          // console.log(this.rooms[index]);
          let temporary = this.users[this.uniqueactive];
          // console.log(temporary);
          if(index == this.uniqueactive)
          {

            if(index!=0)
            {this.users.splice(0,0,this.users.splice(index,1)[0]);
              this.rooms.splice(0,0,this.rooms.splice(index,1)[0]);
                 this.savedNotification.splice(0,0,this.savedNotification.splice(index,1)[0]);
                 this.noti.splice(0,0,this.noti.splice(index,1)[0]);
                 this.activeArray[0]=true;
                 this.uniqueactive = 0;
            }
          }
          else{
            if(data.sender!=this.id.name)
            {
              if(index==0)
              this.noti[index]=true;
              else
              {this.users.splice(0,0,this.users.splice(index,1)[0]);
              this.rooms.splice(0,0,this.rooms.splice(index,1)[0]);
              this.savedNotification.splice(0,0,this.savedNotification.splice(index,1)[0]);
              this.noti.splice(0,0,this.noti.splice(index,0)[0]);
              this.noti[0]=true;
              if(index>this.uniqueactive && this.uniqueactive!=-1)
              {this.activeArray[this.uniqueactive]=false;this.uniqueactive=this.uniqueactive+1;
                this.activeArray[this.uniqueactive]=true;}
              }
            }   
          }
          // console.log(this.noti);
      });
  }

  userSelected(user,i){
    if(this.uniqueactive==i)
    {

    }
    else
    {  
    // console.log(user);
    this.noti[i]=false;
    if(this.uniqueactive!=-1)
    this.activeArray[this.uniqueactive]=false;
    this.activeArray[i]=true;
    this.uniqueactive = i;
    this.authService.getRoomName(user.id).subscribe(name => {
        // console.log(name.data._id);
        this.userService.emitname(name.data._id);

    },err => {
      console.log(err);
    });
  	this.userService.emit(user);
  }
  }
  filt()
  {
    this.users = this.tempusers.filter(data =>data['name'].match(this.searchText));
    // console.log(this.searchText);
  }
   openDialog(event,e,name): void {
     event.stopPropagation();
     const dialogRef = this.dialog.open(DeleteComponent,{
      data:{id:e,name:name}
    });

    
  }
  openProfileImg(event,img,name,about) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProfileImageComponent,{
      data:{img:img,name:name,about:about}
    });
  }
}
 
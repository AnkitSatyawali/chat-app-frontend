import { Component, OnInit , OnDestroy} from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AudiochatComponent } from './audiochat/audiochat.component';
import { OpenimageComponent } from './openimage/openimage.component';
import { SendfileComponent } from "./sendfile/sendfile.component";
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
file; 
fileToUpload: File;
isFile=false;
flag=false; 
n = <any>navigator;
  constructor(private snackBar: MatSnackBar,private sanitizer: DomSanitizer,public dialog: MatDialog,private authService:AuthService,private userService:UserService,private chatService : ChatService) { }

  ngOnInit() {
    console.log(moment().format('LLL'));
  	this.userService.userInfo.subscribe(user => {
        this.user= user;
        if(this.user.image.slice(0,5)!='https')
        this.user.image = this.user.image;
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
       if(message.data.length>0)
         this.flag=true;
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
          if(this.user!=null && data.sender === this.user.id){
          this.messageArray.push(data);
          console.log(this.messageArray);
          this.chatService.updateMessage(data.roomName);}
      }); 
    this.userService.sendFilesnoti.subscribe(result => {
      console.log(result);
      for(let i=0;i<result.length;i++)
      {
        this.isFile=true;
        this.send(result[i]);
      }
    }) 
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
      time : moment().format('LLL'),
      isFile : this.isFile 
    }
    this.chatService.sendMessage(data);
    this.messageArray.push(data);
    this.isFile = false;
  }
  onImagePicked(file: FileList) {
    // this.imageAdded();
  
    this.openDialog(file);
    // this.fileToUpload = file.item(0);
    // var reader = new FileReader();
    // reader.onload = (event: any) => {
    //   this.file = event.target.result;
    // };
    // reader.readAsDataURL(this.fileToUpload);
  }
   openDialog(e:FileList): void {
     const dialogRef = this.dialog.open(SendfileComponent, {
      data:{
        files:<FileList>e,
        roomName:this.roomName
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  refactorurl(url:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${API_URL}`+url);
  }
  checkCondition(message : string)
  {
    const sub = message.substr(message.length - 3);
    if(sub==='png' || sub==='jpg' || sub==='peg' || sub==='gif')
      return true;
    return false;
  }
  editName(message:string)
  {
    let sub = message.split('/')[2];
    if(sub.length>9)
      return sub = sub.substring(0,6)+'...'+ sub.substr(sub.length-4);
    return sub;
  }
  download()
  {
    console.log('clicked');
  }
  openImage(link:string):void {
     const dialogRef = this.dialog.open(OpenimageComponent, {
      data:link
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  videoCall()
  {
    this.snackBar.open("It will be available soon","close",{duration:2000});
    /*this.n.mediaDevices.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
    console.log(this.n.mediaDevices.getUserMedia);
    if(this.n.mediaDevices.getUserMedia){
    const dialogRef = this.dialog.open(AudiochatComponent, {
      data:{roomName:this.roomName,userImage: this.user.image},
      disableClose: true,
      width:'90vw',
      height: '90vh',
      padding: '0.1rem'
    });
   }
   else{
     this.snackBar.open("You will have to provide permission to access video call","close",{duration:2000});
   }*/
   //Above code will be added to make video call feature possible.

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log("The dialog was closed");
    // });
  }
  voiceCall()
  {
    console.log("Video call");
  }
 // ngOnDestroy() {
 //    const data = {
 //      roomName : this.roomName,
 //      name : this.user.name
 //    }
 //    this.chatService.leaveRoom(data);
 // }
}

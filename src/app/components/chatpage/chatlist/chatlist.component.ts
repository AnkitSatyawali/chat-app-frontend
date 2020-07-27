import { Component, OnInit,ElementRef ,ViewChild, OnDestroy,HostListener,AfterViewInit} from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { AudiochatComponent } from './audiochat/audiochat.component';
import { OpenimageComponent } from './openimage/openimage.component';
import { SendfileComponent } from "./sendfile/sendfile.component";
import { UserService } from '../../../services/user.service';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import API_URL from '../../../config/API_URL';
@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit {
user;
forreply=true;  
num;
ld=false;
prevnum;
ld1=false;
roomName;
message="";
show=false;
id;
messageArray;
file; 
fileToUpload: File;
isFile=false;
flag=false;
load=false; 
n = <any>navigator;
ht;
encp;
  constructor(private cookieService:CookieService,private snackBar: MatSnackBar,private sanitizer: DomSanitizer,public dialog: MatDialog,private authService:AuthService,private userService:UserService,private chatService : ChatService) { }
@ViewChild('scrollMe') private test: ElementRef;


@HostListener("scroll", ['$event']) 
 
   scrollHandler(event) {
      // console.debug("Scroll Event");
      let el: HTMLElement = this.test.nativeElement;
      if(el.scrollTop == 0 && this.num > this.prevnum)
      {this.getMore();
        // console.log('send');
      }
   }
  ngOnInit() {
    // console.log(moment().format('LLL'));
  	this.userService.userInfo.subscribe(user => {
        this.user= user;
        if(this.user.image.slice(0,5)!='https')
        this.user.image = this.user.image;
        this.userService.emitnoti(user);
        this.messageArray = new Array();
        // console.log(user);
        if(user)
        	this.show=true;
      });
    this.authService.getId().subscribe(data => {
      this.id = data;
    })
    this.userService.RoomName.subscribe(name => {
        this.ld=true;
        this.roomName= name;
        
        // if(!this.cookieService.get(name))
        // {this.encp = CryptoJS.AES.encrypt(JSON.stringify(name+environment.appName),environment.appName).toString();
        // // let key = bcrypt.hashSync(this.rooms[i]+environment.appName);
        // this.cookieService.set(name,this.encp);}
        // else
        //   this.encp = this.cookieService.get(name)
        this.chatService.updateMessage(name);
          this.chatService.getMessages(this.roomName).subscribe(message => {
       let i;
       // console.log(message);
       if(message.data.length==20)
       {
           this.num=2;
          this.prevnum=1;
       }
       else
       {
         this.num=2;
         this.prevnum=2;
       }
       if(message.data.length>0)
         this.flag=true; 
       for(i=0;i<message.data.length;i++){
         let temp = message.data[i].message;
         // console.log(this.encp);
          let bytes = CryptoJS.AES.decrypt(temp, this.roomName+environment.appName);
          // console.log(bytes.toString(CryptoJS.enc.Utf8));
          message.data[i].message =(bytes.toString(CryptoJS.enc.Utf8));
         this.messageArray.push(message.data[i]);
       }
       let el: HTMLElement = this.test.nativeElement;
       el.scrollTop = el.scrollHeight;
       this.ld=false;
       this.forreply=false;
       setTimeout(()=>{ el.scrollTop = el.scrollHeight; },1)
       // console.log(el.scrollTop,el.scrollHeight);
       // console.log(this.messageArray);
       },err =>{
         console.log(err);
       });
        this.chatService.joinRoom(this.roomName,this.user.name);
        // console.log(name);
      });
   
    this.chatService.newMessageReceived()
        .subscribe(data=>{
          // console.log(data);
          // console.log(this.messageArray)
          if(this.user!=null && data.sender === this.user.id){
        //  if(!this.cookieService.get(data.roomName))
        // {this.encp = CryptoJS.AES.encrypt(JSON.stringify(data.roomName+environment.appName),environment.appName).toString();
        // // let key = bcrypt.hashSync(this.rooms[i]+environment.appName);
        // this.cookieService.set(data.roomName,this.encp);}
        // else
        //   this.encp = this.cookieService.get(data.roomName)
         let bytes = CryptoJS.AES.decrypt(data.message, data.roomName+environment.appName);
         data.message = (bytes.toString(CryptoJS.enc.Utf8));
         // console.log(data.message);
          this.messageArray.push(data);
          // console.log(this.messageArray);
          let el: HTMLElement = this.test.nativeElement;
          setTimeout(()=>{ el.scrollTop = el.scrollHeight; },1)

          this.chatService.updateMessage(data.roomName);
        }
      }); 
    this.userService.sendFilesnoti.subscribe(result => {
      // console.log(result);
      for(let i=0;i<result.length;i++)
      {
        this.isFile=true;
        this.send(result[i]);
      }
    }) 
  }
  send(message : string)
  {
  	// console.log(message);
  	this.message = ""; 
    let da = {
      roomName: this.roomName,
      message : message,
      sender : this.id.name,
      receiver : this.user.id,
      time : moment().format('LLL'),
      timeStamp:new Date(), 
      isFile : this.isFile 
    }
    // console.log(da);
    let copy = Object.assign({}, da);
    this.messageArray.push(copy)
    this.userService.emitMoveTop(this.user);
    let tem = da;
    tem.message = CryptoJS.AES.encrypt(tem.message,tem.roomName+environment.appName).toString();
    this.chatService.sendMessage(tem);
    
    // console.log(this.messageArray);
    let el: HTMLElement = this.test.nativeElement;
    setTimeout(()=>{ el.scrollTop = el.scrollHeight; },1)
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
    // console.log('clicked');
  }
  openImage(link:string):void {
     const dialogRef = this.dialog.open(OpenimageComponent, {
      data:link
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("The dialog was closed");
    });
  }
  getMore(){
    if(this.num>this.prevnum && this.messageArray[0])
    { 
      // console.log(this.messageArray[0].timeStamp);
      this.prevnum=this.num;
      this.ld1=true;
      this.chatService.getMoreMessages(this.roomName,this.num,this.messageArray[0].timeStamp).subscribe(result => {
        // console.log(result)
         if(result.data.length>=20)
         {
           this.num=this.num+1;
         }
         this.ld1=false;
         let i;
         for(i=result.data.length-1;i>=0;i--){
        //    if(!this.cookieService.get(this.roomName))
        // { this.encp = CryptoJS.AES.encrypt(JSON.stringify(this.roomName+environment.appName),environment.appName).toString();
        // // let key = bcrypt.hashSync(this.rooms[i]+environment.appName);
        // this.cookieService.set(this.roomName,this.encp);}
        // else
        //   this.encp = this.cookieService.get(this.roomName)
          let bytes = CryptoJS.AES.decrypt(result.data[i].message, this.roomName+environment.appName);
          result.data[i].message = (bytes.toString(CryptoJS.enc.Utf8)).slice(1,-1);
       }
         let el: HTMLElement = this.test.nativeElement;
           var top = el.scrollHeight;
          this.messageArray = (result.data).concat(this.messageArray);
          
           if(result.data.length!=0)
           setTimeout(()=>{ el.scrollTop = el.scrollHeight - top; },1)
       
         // this.messageArray.push(result.data[i]);
       
      })
    }
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

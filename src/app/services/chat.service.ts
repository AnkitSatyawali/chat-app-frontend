import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import API_URL from '../config/API_URL'; 
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // private socket = io('https://uchatappbackend.herokuapp.com');
  private socket = io('https://gitforker-backend.herokuapp.com');
  httpOptions;
  constructor(private authService : AuthService,private router: Router,private http:HttpClient,private cookieService:CookieService) {
}
    
    joinRoom(roomname,name)
    {
        // console.log(roomname);
        const data = {
            roomName : roomname,
            name : name
        }
        this.socket.emit('join',data);
    }

    // newUserJoined()
    // {
    //     let observable = new Observable<{user:String, message:String}>(observer=>{
    //         this.socket.on('new user joined', (data)=>{
    //             observer.next(data);
    //         });
    //         return () => {this.socket.disconnect();}
    //     });

    //     return observable;
    // }

    leaveRoom(data){
        this.socket.emit('leave',data);
    }

    // userLeftRoom(){
    //     let observable = new Observable<{user:String, message:String}>(observer=>{
    //         this.socket.on('left room', (data)=>{
    //             observer.next(data);
    //         });
    //         return () => {this.socket.disconnect();}
    //     });

    //     return observable;
    // }

    sendMessage(dt)
    { 
        // console.log(dt);
        let data=dt;
        this.httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.cookieService.get('authorization')

    }) 
  };     
  let encp;
  // if(!this.cookieService.get(data.roomname))
  //         {encp = CryptoJS.AES.encrypt(JSON.stringify(data.roomName+environment.appName),environment.appName).toString();
  //       // let key = bcrypt.hashSync(this.rooms[i]+environment.appName);
  //       this.cookieService.set(data.roomName,encp);
  //                     // this.cookieService.set(data.roomname+environment.appName,salt);
  //         }
  //         else
  //             encp = this.cookieService.get(data.roomname);
           
        this.http.post<any>(`${API_URL}chats/sendMessage`,{roomName:data.roomName,receiver:data.receiver,message : data.message,time : data.time,isFile:data.isFile,timeStamp:data.timeStamp},this.httpOptions).subscribe(result => {
            // console.log(data);
            this.socket.emit('message',data);
        });    
    }
    getMessages(name):Observable<any>{
        this.httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.cookieService.get('authorization')

    })
  }; 
        // console.log(this.httpOptions);
        return this.http.get<any>(`${API_URL}chats/getMessge/${name}&&${1}`,this.httpOptions);
    }
    getMoreMessages(name,num,ts):Observable<any>
    {
         this.httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.cookieService.get('authorization')

    })
  }; 
  // console.log(ts);
        console.log(this.httpOptions);
        return this.http.get<any>(`${API_URL}chats/getMessge/${name}&&${num}&&${ts}`,this.httpOptions);   
    }
    updateMessage(name){
        this.httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.cookieService.get('authorization')

    }) 
  }; 
        this.http.post(`${API_URL}chats/update`,{roomName : name},this.httpOptions).subscribe();
    }
    newMessageReceived(){
        let observable = new Observable<any>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
    uploadFiles(file,roomName):Observable<any>{
        // const data = {
        //     files:file,
        //     roomName:roomName
        // };
        this.httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.cookieService.get('authorization')

    }),  
    reportProgress: true,  
    observe: 'events'  
  }; 
        const fd = new FormData();
        for(let i=0;i<file.length;i++)
        fd.append('files',file[i]);
        fd.append('roomName',roomName);  
        // console.log(data);
        return this.http.post<any>(`${API_URL}chats/sendFile`,fd,this.httpOptions);
    }

}

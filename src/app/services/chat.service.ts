import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import API_URL from '../config/API_URL'; 
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io('http://localhost:4000');
  httpOptions;
  constructor(private authService : AuthService,private router: Router,private http:HttpClient) {
  this.httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.authService.getUserToken()

    })
  }; 
}
    
    joinRoom(roomname,name)
    {
        console.log(roomname);
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
        console.log(dt);
        let data=dt;
        this.http.post<any>(`${API_URL}chats/sendMessage`,{roomName:data.roomName,receiver:data.receiver,message : data.message,time : data.time},this.httpOptions).subscribe(result => {
            this.socket.emit('message',data);
        });
        
        
    }
    getMessages(name):Observable<any>{
        return this.http.get<any>(`${API_URL}chats/getMessge/${name}`,this.httpOptions);
    }
    updateMessage(name){
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
    

}

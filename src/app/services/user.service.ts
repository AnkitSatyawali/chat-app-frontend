import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  private userFun = new Subject<Object>();
  private roomName = new Subject<string>();
  private noti = new Subject<Object>();
  private noti2 = new Subject<Object>();
  private addedUser = new Subject<Object>();
  private sendFiles = new Subject<Array<string>>();
  userInfo = this.userFun.asObservable();
  RoomName = this.roomName.asObservable();
  added = this.addedUser.asObservable();
  notification = this.noti.asObservable();
  notif = this.noti2.asObservable();
  sendFilesnoti = this.sendFiles.asObservable();
  emit(user)
  {
  	this.userFun.next(user);
  }
  emitname(rname:string)
  {
  	console.log(rname);
  	this.roomName.next(rname);
  }
  emituser(user)
  {
    console.log(user);
    this.addedUser.next(user);
  }
  emitnoti(noti)
  {
    this.noti.next(noti);
  }
  emitnotif(index)
  {
    this.noti2.next(index);
  }
  emitFiles(filesArray : Array<string>)
  {
    this.sendFiles.next(filesArray);
  }
}

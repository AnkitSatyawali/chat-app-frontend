import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {  
    HttpClient,  
    HttpEvent,  
    HttpEventType  
} from '@angular/common/http';
import { ChatService } from '../../../../services/chat.service';
import { UserService } from '../../../../services/user.service';
@Component({
  selector: 'app-sendfile',
  templateUrl: './sendfile.component.html',
  styleUrls: ['./sendfile.component.css']
})
export class SendfileComponent implements OnInit {
file:FileList=null;
progress;
up=false;
fileArray=[];
  constructor(private userService: UserService,private snackBar: MatSnackBar,public dialogRef: MatDialogRef<SendfileComponent>,@Inject(MAT_DIALOG_DATA) public data,private chatService : ChatService) { 
  dialogRef.disableClose = true;
}

  ngOnInit() {
  	// console.log(this.data);
  	this.file = <FileList>this.data.files;
  	this.fileArray = Array.from(this.file);
  }
  onNoClick(): void {
      this.dialogRef.close();
    }
  sendMessage() {
    this.up=true;
  	this.chatService.uploadFiles(this.fileArray,this.data.roomName).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          // console.log('Request has been made!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          // console.log('User successfully created!', event.body);

          this.userService.emitFiles(event.body.files);

          this.onNoClick();
          this.snackBar.open('Files Sent successfully' , "close",{duration: 5000});
      }
    },(err) => {
            const message = "File/Files can not be uploaded";
            this.onNoClick();
           this.snackBar.open(message , "close",{duration: 5000});
    })
  }
  remove(index:number)
  {
  	this.fileArray.splice(index,1);
  	if(this.fileArray.length==0)
  		this.onNoClick();
  }
}

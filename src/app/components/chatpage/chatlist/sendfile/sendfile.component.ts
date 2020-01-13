import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { ChatService } from '../../../../services/chat.service';
import { UserService } from '../../../../services/user.service';
@Component({
  selector: 'app-sendfile',
  templateUrl: './sendfile.component.html',
  styleUrls: ['./sendfile.component.css']
})
export class SendfileComponent implements OnInit {
file:FileList=null;
fileArray=[];
  constructor(private userService: UserService,public dialogRef: MatDialogRef<SendfileComponent>,@Inject(MAT_DIALOG_DATA) public data,private chatService : ChatService) { }

  ngOnInit() {
  	console.log(this.data);
  	this.file = <FileList>this.data.files;
  	this.fileArray = Array.from(this.file);
  }
  onNoClick(): void {
      this.dialogRef.close();
    }
  sendMessage() {
  	this.chatService.uploadFiles(this.fileArray,this.data.roomName).subscribe(result => {
  		console.log(result);
  		this.userService.emitFiles(result.files);
  		this.onNoClick();
  	})
  }
  remove(index:number)
  {
  	this.fileArray.splice(index,1);
  	if(this.fileArray.length==0)
  		this.onNoClick();
  }
}

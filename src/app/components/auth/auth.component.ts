import { Component, OnInit , Inject} from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// 19120191942
import {MatTabsModule} from '@angular/material/tabs';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
}) 
export class AuthComponent implements OnInit {
  
  constructor(private chatService:ChatService,private router : Router,private snackBar: MatSnackBar,public dialogRef: MatDialogRef<AuthComponent>,@Inject(MAT_DIALOG_DATA) public data,private authService : AuthService) { }

  ngOnInit() {
    const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const REDIRECT_URL = "http://localhost:4000/userAuth/login";
const ENCODEC_REDIRECT_URL = encodeURIComponent(REDIRECT_URL);
const CLIENT_ID = "58d2ec94ff7ad976e6c2";
  }
    onNoClick(): void {
      this.dialogRef.close();
    }
    onSignup(form : NgForm)
    {
       console.log(form.value);
       this.authService.signupUser(form.value).subscribe(data => {
       	   const message = "You signed up successfully now login to enjoy the U-chat";
           this.snackBar.open(message , "close",{duration: 5000});

       },err => {
           const message = "Sorry for inconvience this error is due to some internal problem";
           this.snackBar.open(message , "close",{duration: 5000});
       });
    }
    onLogin(form : NgForm)
    {
    	console.log(form.value);
    	this.authService.loginUser(form.value.email,form.value.password).subscribe(data => {
            this.snackBar.open(data.message , "close",{duration: 5000});
            // this.chatService.joinRoom(data);
            if(data.token!=="")
            {
            this.authService.setUserTokenToCookie(data.token);
            this.router.navigate(['/chats']);
           }
    	},err => {
    		console.log(err);
        this.snackBar.open(err.message , "close",{duration: 5000});
            
    	})
    }
}

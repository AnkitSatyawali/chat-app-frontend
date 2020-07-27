import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import API_URL from '../../config/API_URL';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
user;
showname=false;
showstatus=false;
  constructor(private authService:AuthService,private snackBar: MatSnackBar) { }
loading=false;
  ngOnInit() {
    this.authService.isUserLoggedIn('/edit-profile');
    this.authService.getLoggedUser().subscribe(data =>{
      this.user = data.result;
      if(this.user.image.slice(0,5)!='https')
        this.user.image = API_URL +this.user.image;
      this.loading=true; 
    },err => {
      console.log(err);
    })
  }
opene()
  {
    this.showname = !this.showname;
  }
  onStatus(form : NgForm)
  {
    // console.log(form.value);
    this.showstatus = !this.showstatus;
    this.authService.updateStatus(form.value.about).subscribe(data => {
       this.snackBar.open(data.message , "close",{duration: 5000});
    },err => {
       this.snackBar.open(err.message , "close",{duration: 5000});
    })
  }
  onUsername(form : NgForm)
  {
    // console.log(form.value);
    this.showname = false;
    this.authService.updateUsername(form.value.username).subscribe(data => {
       this.snackBar.open(data.message , "close",{duration: 5000});
    })
  }
  opena()
  {
    this.showstatus = !this.showstatus;
  }
  Logout(){
  	this.authService.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import API_URL from '../../config/API_URL';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
user;
githubUser;
githubRepos;
showemail=false;
showstatus = false;
showUsername = false;
imageUpload : File;
imagePreview;  
check = false;

  constructor(private authService:AuthService,private snackBar: MatSnackBar) { }
loading=false;
  ngOnInit() {
  	this.authService.isUserLoggedIn('/profile');
  	this.authService.getLoggedUser().subscribe(data =>{
      this.user = data.result;
      if(this.user.image.slice(0,5)!='https')
        this.user.image = API_URL +this.user.image;
      // console.log(data);
      var token = this.authService.getGithubToken();
      this.authService.getGithubProfile(token).subscribe(data => {
        this.githubUser = data;
        this.authService.getGithubRepos(this.githubUser.repos_url).subscribe(data => {
          this.githubRepos = data;
          this.loading=true
        },err => {
          console.log(err);
        })
      },err => {
        console.log(err);
      })
    }) 
  }
  Logout(){
  	this.authService.logout();
  }
  // onEmail(form:NgForm)
  // {
  //   console.log(form.value);
  //   this.showemail = false;
  //   this.authService.updateUsername(form.value.username).subscribe(data => {
  //       this.snackBar.open(data.message , "close",{duration: 5000});
  //   },err => {
  //      this.snackBar.open(err.message , "close",{duration: 5000});
  //   })
  // }
  opene()
  {
    this.showemail = !this.showemail;
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
    this.showUsername = false;
    this.authService.updateEmail(form.value.email).subscribe(data => {
       this.snackBar.open(data.message , "close",{duration: 5000});
    })
  }
  opena()
  {
    this.showstatus = !this.showstatus;
  }
  openn()
  {
    this.showUsername = !this.showUsername;
  }
  onImagePicked(file:FileList)
  { 
    this.check = true;
    // console.log(file.item(0));
    this.imageUpload = file.item(0);
         this.authService.updateUserImage(this.imageUpload).subscribe(data=>{
         this.snackBar.open(data.message , "close",{duration: 5000});
      },err => {
        console.log(err);
        this.snackBar.open(err.message , "close",{duration: 5000});
      })
      var reader = new FileReader();
      reader.onload = (event:any) => {
         this.imagePreview = event.target.result;
      }
 
      reader.readAsDataURL(this.imageUpload);
  }
  up(form:NgForm)
  {
    // console.log(form.value);
  }
}

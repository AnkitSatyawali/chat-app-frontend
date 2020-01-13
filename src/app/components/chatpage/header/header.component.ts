import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import API_URL from '../../../config/API_URL';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  seh=false;
  users;
  user;
  siz;
  constructor(private userService:UserService,private authService : AuthService,private snackBar: MatSnackBar) { }

  ngOnInit() {
   
    this.authService.getFriends().subscribe(data =>{
       this.siz = data.friends.length;
       console.log(this.siz);
    })
    this.authService.getAllUsers().subscribe(data => {
    	this.users = data;
      
    	console.log(this.users);
    },err=> {
    	console.log(err);
    })
  	this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
     this.authService.getLoggedUser().subscribe(data =>{
      this.user = data.result;
      if(this.user.image.slice(0,5)!='https')
        this.user.image = API_URL +this.user.image;
      console.log(data);
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    return this.users.filter(option => option['name'].toLowerCase().includes(filterValue));
  }
  Logout(){
    console.log("clicked");
  	this.authService.logout();
  } 
  selectedUser(user)
  {
  	console.log(user);
  	this.authService.makeFriends(user).subscribe(result => {
  		this.snackBar.open(result.message , "close",{duration: 5000});
      this.userSelected(user);
  	})
  	this.userService.emituser(user);
  	this.seh=false;
  }
  open()
  {
  	this.seh = !this.seh;
  }
  userSelected(user){
    console.log(user);
    this.authService.getRoomName(user.id).subscribe(name => {
        console.log(name.data._id);
        this.authService.userAdded(user,name.data._id);
        this.userService.emitname(name.data._id);
    },err => {
      console.log(err);
    });
    this.userService.emit(user);
  }
  
}

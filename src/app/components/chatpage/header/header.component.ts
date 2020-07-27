import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounce } from 'lodash';
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
  results;
  temps;
  seh=false;
  users;
  user;
  siz;
  load=false;
  httpOptions;
  noResults=false;
  constructor(private userService:UserService,private authService : AuthService,private snackBar: MatSnackBar,private httpClient: HttpClient) { 
    this.search = debounce(this.search, 1000);
    this.httpOptions = {
      headers: new HttpHeaders({
  
        'authorization':  this.authService.getUserToken()
  
      })
    };
  }

  ngOnInit() {
    this.authService.getAllUsers().subscribe(data => {
    	this.users = data;
      let i;
      for(i=0;i<this.users.length;i++)
      {
          if(this.users[i].image.slice(0,5)!='https')
            this.users[i].image = API_URL +this.users[i].image;
      }
    	// console.log(this.users);
    },err=> {
    	console.log(err);
    })
     this.authService.getLoggedUser().subscribe(data =>{
      this.user = data.result;
      if(this.user.image.slice(0,5)!='https')
        this.user.image = API_URL +this.user.image;
      // console.log(data);
    })
  }
  search(event) {
     const searchText = event.target.value;
    // console.log(event);
    this.load=true;
    this.noResults=false;
    this.httpClient.get<any>("https://gitforker-backend.herokuapp.com/userAuth/getallusers?name=" + searchText,this.httpOptions).subscribe(data =>{
    this.temps = data;
    this.load=false;
    this.results = this.temps.users;
    let i;
    if(this.results){
    for(i=0;i<this.results.length;i++)
      {
        if(this.results[i].image.slice(0,5)!='https')
        this.results[i].image = API_URL +this.results[i].image;
      }
     }
    if(this.temps.len==0)
      this.noResults=true
    else if(this.temps.len>0)
    this.noResults=false;
      if(searchText=="")
      this.noResults=false;
      // console.log(this.results);
    });
}
  Logout(){
    // console.log("clicked");
  	this.authService.logout();
  } 
  userSelected(user,roomName)
  {
  	// console.log(user);
  	this.authService.makeFriends(user,roomName).subscribe(result => {
  		this.snackBar.open(result.message , "close",{duration: 5000});
  	})
  	this.userService.emituser(user);
  	this.seh=false;
  }
  open()
  {
  	this.seh = !this.seh;
  }
  selectedUser(user){
    // console.log(user);
    this.authService.getRoomName(user.id).subscribe(name => {
        // console.log(name.data._id);
        this.authService.userAdded(user,name.data._id);
        this.userService.emitName2(name.data._id);
        this.userService.emitname(name.data._id);
        this.userService.emitSavedNoti({updatedBy:name.data.updatedBy,state:name.data.state});
        this.userSelected(user,name.data._id);
    },err => {
      console.log(err);
    });
    this.userService.emit(user);
  }
  
}

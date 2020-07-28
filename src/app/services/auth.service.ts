import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import API_URL from '../config/API_URL';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
get;
private socket = io('https://gitforker-backend.herokuapp.com');
  constructor(private router: Router,private http:HttpClient,private cookieService:CookieService ) { }
   httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.getUserToken()

    })
  };
  githubhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  signupUser(userInput):Observable<any>{
    // console.log(userInput);
  	return this.http.post<any>(`${API_URL}userAuth/signup`,{name:userInput.username,email:userInput.email,password:userInput.password});
  }
  loginUser(email,password):Observable<any>{
    // console.log(email);
    return this.http.post<any>(`${API_URL}userAuth/login`,{email,password},this.httpOptions);

  }

    setUserTokenToCookie(token){
    
    this.cookieService.set('authorization',token)
    this.httpOptions = {
      
      headers: new HttpHeaders({
  
        'authorization':  this.cookieService.get('authorization')
  
      })
    };
    
  }
  setGithubToken(token1,token2){
    // console.log(token1);
    this.cookieService.set('authorization',token1,365,'/');
    this.cookieService.set('githubToken',token2,365,'/');
  }
  getId(){
    this.httpOptions = {
      
      headers: new HttpHeaders({
  
        'authorization':  this.cookieService.get('authorization')
  
      })
    };
    return this.http.get<any>(`${API_URL}userAuth/getId`,this.httpOptions);	
  }
  loginCheckWithoutCookies(token)
  {
    let newhttpOptions = {
      headers: new HttpHeaders({
  
        'authorization':  token
  
      })
    }
    return this.http.get<any>(`${API_URL}userAuth/getId`,newhttpOptions);
  }
  getAllUsers():Observable<any>{
    return this.http.get<any>(`${API_URL}userAuth/getallusers`,this.httpOptions);
  }
    getUserToken(){
    // console.log(this.cookieService.get('authorization'))
    return this.cookieService.get('authorization');
  }
  getGithubToken(){
    // console.log(this.cookieService.get('githubToken'))
    return this.cookieService.get('githubToken');
  }
  getGithubProfile(token):Observable<any> 
  {
    return this.http.get<any>(`https://api.github.com/user`,{headers:{Authorization:'token '+token}});
  }
  getGithubRepos(url):Observable<any>
  {
    return this.http.get<any>(url);
  }
    logout(){
  
    this.deleteUserTokenCookie();
    this.httpOptions = {
      headers: new HttpHeaders({
  
        'authorization':  this.getUserToken()
  
      })
    };
    this.router.navigate(['/']);
  }
    deleteUserTokenCookie(){
    this.cookieService.deleteAll();
  }
  isUserLoggedIn(route){
    this.getId().subscribe(data => {
      // console.log(data)
      if(route=='/home')
        this.router.navigate(['/chats']);
      else
      this.router.navigate([route]);
    },err =>{
      // console.log(err);
      this.router.navigate(['/home']);
    })

    
  }
  getRoomName(userId):Observable<any>{
        return this.http.post<any>(`${API_URL}rooms/makeRoom`,{user1 : userId},this.httpOptions);
    }
    getFriends():Observable<any>{
      return this.http.get<any>(`${API_URL}userAuth/getall`,this.httpOptions);
    }
    makeFriends(data,roomName):Observable<any>{
      return this.http.post<any>(`${API_URL}userAuth/make`,{id:data.id,roomName:roomName},this.httpOptions);
    }
    deleteFriend(id):Observable<any>
    {
      return this.http.post<any>(`${API_URL}userAuth/deleteFriend`,{id:id},this.httpOptions);
    }
    getLoggedUser():Observable<any>{
      return this.http.get<any>(`${API_URL}userAuth/getloggedUser`,this.httpOptions);
    }
    updateEmail(email):Observable<any>{
      return this.http.post<any>(`${API_URL}userAuth/updateuseremail`,{email:email},this.httpOptions);
    }
    updateStatus(status):Observable<any>{
      return this.http.post<any>(`${API_URL}userAuth/updateuserstatus`,{about:status},this.httpOptions);
    }
    updateUsername(name):Observable<any>{
      return this.http.post<any>(`${API_URL}userAuth/updateusername`,{name:name},this.httpOptions);
    }
    updateUserImage(image:File):Observable<any>{
      let file = new FormData();
      file.append('image',image);
      return this.http.post<any>(`${API_URL}userAuth/updateuserimage`,file,this.httpOptions);
    }
    userAdded(data,id){
      const newData = {
        data : data,
        id : id
      };
      this.socket.emit('newFriend',newData);
    }
    userAddedSuccessfully(){
      let observable = new Observable<any>(observer=>{
            this.socket.on('new Friend', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

} 


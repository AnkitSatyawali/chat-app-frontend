import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import API_URL from '../config/API_URL';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
get;
  constructor(private router: Router,private http:HttpClient,private cookieService:CookieService ) { }
   httpOptions = {
    headers: new HttpHeaders({

      'authorization':  this.getUserToken()

    })
  };
  signupUser(userInput):Observable<any>{
    console.log(userInput);
  	return this.http.post<any>(`${API_URL}userAuth/signup`,{name:userInput.username,email:userInput.email,password:userInput.password});
  }
  loginUser(email,password):Observable<any>{
    console.log(email);
    return this.http.post<any>(`${API_URL}userAuth/login`,{email,password},this.httpOptions);

  }
    setUserTokenToCookie(token){
    
    this.cookieService.set('authorization',token)
    this.httpOptions = {
      
      headers: new HttpHeaders({
  
        'authorization':  this.getUserToken()
  
      })
    };
    
  }
  getId(){
    if(this.httpOptions)
    return this.http.get<any>(`${API_URL}userAuth/getId`,this.httpOptions);	
  }
  getAllUsers():Observable<any>{
    return this.http.get<any>(`${API_URL}userAuth/getallusers`,this.httpOptions);
  }
    getUserToken(){
    console.log(this.cookieService.get('authorization'))
    return this.cookieService.get('authorization');
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
    this.cookieService.delete('authorization')
  }
  isUserLoggedIn(route){
    this.getId().subscribe(data => {
      console.log(data)
      this.router.navigate([route]);
    },err =>{
      console.log(err);
      this.router.navigate(['/home']);
    })

    
  }
  getRoomName(userId):Observable<any>{
        return this.http.post<any>(`${API_URL}rooms/makeRoom`,{user1 : userId},this.httpOptions);
    }
    getFriends():Observable<any>{
      return this.http.get<any>(`${API_URL}userAuth/getall`,this.httpOptions);
    }
    makeFriends(data):Observable<any>{
      return this.http.post<any>(`${API_URL}userAuth/make`,{email:data.email,id:data.id,name:data.name,image:data.image,about:data.about},this.httpOptions);
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
} 


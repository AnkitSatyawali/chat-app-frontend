import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
@Injectable()
export class AuthGuard  {
 //    constructor(private authService : AuthService,private router : Router){}
	// canActivate(route: ActivatedRouteSnapshot, state : RouterStateSnapshot){
	//    this.authService.getId().subscribe(data=>{
	//    	console.log(data);
	//    	return true;
	//    },err => {
	//    	this.router.navigate(['/home']);
	//    	return false;
	//    })
	// }
}
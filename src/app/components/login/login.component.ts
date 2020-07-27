import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,private route:ActivatedRoute, private authService: AuthService) { }
flah=true; 
  ngOnInit() { 
  		let tokens = this.route.snapshot.paramMap.get('tokens'); 
  		var res = tokens.split(" ");
  		// console.log(res[0]);
      // console.log(res[1]);
  		if(res[0]!==undefined && res[1]!==undefined)
  			this.authService.loginCheckWithoutCookies(res[0]).subscribe(data => {
  				this.authService.setGithubToken(res[0],res[1]);
  				this.router.navigate(['/chats']);
          // console.log('home');
  			}, err => {
  				console.log(err);
  			  this.router.navigate(['/home']);
  			})
  	}
 
}

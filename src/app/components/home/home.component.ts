import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AuthComponent } from '../auth/auth.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog,private authService:AuthService) { }

  ngOnInit() {
    this.authService.isUserLoggedIn('/home');
  }
   openDialog(e): void {
     const dialogRef = this.dialog.open(AuthComponent, {
      data:e 
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("The dialog was closed");
    });
  }
}
 
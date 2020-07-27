import { Component, OnInit , Inject} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
isLoading=false;
message;
  constructor(private router : Router,private authService : AuthService,public dialogRef: MatDialogRef<DeleteComponent>,@Inject(MAT_DIALOG_DATA) public data) { 
  	dialogRef.disableClose = true;
  }

  ngOnInit() {
  	// console.log(this.data);
  }
  onNoClick(): void {
      this.dialogRef.close();
    }

    delete(){
    	this.isLoading=true;
    	this.authService.deleteFriend(this.data.id).subscribe(result => {
    		this.isLoading=false;
    		this.message=result.message;
        this.onNoClick();
    		window.location.reload();
    	},err => {
    		this.message =err.message;
    	})
    }

}

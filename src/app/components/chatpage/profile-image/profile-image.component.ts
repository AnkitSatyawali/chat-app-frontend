import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProfileImageComponent>,@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  	// console.log(this.data);
  }
onNoClick(): void {
      this.dialogRef.close();
    }

} 

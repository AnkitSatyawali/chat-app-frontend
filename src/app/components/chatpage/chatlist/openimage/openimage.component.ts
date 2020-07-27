import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import API_URL from '../../../../config/API_URL';

@Component({
  selector: 'app-openimage',
  templateUrl: './openimage.component.html',
  styleUrls: ['./openimage.component.css']
})
export class OpenimageComponent implements OnInit {
link;
  constructor(public dialogRef: MatDialogRef<OpenimageComponent>,@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  	// console.log(this.data);
  	this.link = `${API_URL}`+this.data;
  	// console.log(this.link);
  } 
  onNoClick(): void {
      this.dialogRef.close();
    }

}

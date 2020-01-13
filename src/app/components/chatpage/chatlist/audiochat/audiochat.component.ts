import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import * as Peer from 'simple-peer';
import * as io from 'socket.io-client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-audiochat',
  templateUrl: './audiochat.component.html',
  styleUrls: ['./audiochat.component.css']
})
export class AudiochatComponent implements OnInit {
@ViewChild('myVideo') myVideo:any;
@ViewChild('otherVideo') otherVideo : any;
socket = io('http://localhost:4000');
n = <any>navigator;
image;
peersrc; 
roomName;
  constructor(public dialogRef: MatDialogRef<AudiochatComponent>,@Inject(MAT_DIALOG_DATA) public data,public snackBar: MatSnackBar) { 
  // window.zw = this.data.roomName;
}

  ngOnInit() {
  	console.log(this.data);
  	
  	this.image = this.data.userImage;
  	let socket = io('http://localhost:4000');
  	let video = this.myVideo.nativeElement;
  	console.log(this.peersrc);
  	let client = {
		gotAnswer:false,
		peer:""
	};
  	this.n.mediaDevices.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
  	if(this.n.mediaDevices.getUserMedia)
  	{
  		this.n.getUserMedia({video:true,audio:true},function (stream){
  			// socket.emit('NewClient',zw);
  			video.src = URL.createObjectURL(stream);
  			video.play();

  			function initPeer(type:string)
  			{
  				let peer = new Peer({initiator:(type == 'init')?true:false, stream:stream,trickle:false});
  				peer.on('stream',function(stream) {
  					CreateVideo(stream)
  				})
  				peer.on('close',function(){
  					video="";
  					peer.destroy();
  				})
  				return peer;
  			}  
 
  			function makePeer()
  			{
  				client.gotAnswer = false;
  				let peer = initPeer('init');

  				peer.on('signal',function(data) {
  					const obj = {
  						data : data,
  						// roomName : zw
  					}
  					if(!client.gotAnswer){
  						console.log(obj);
  						socket.emit('Offer',obj);
  					}
  				})
  				client.peer = peer;
  			}

  			function getAnswer(offer)
  			{
  				let peer = initPeer('notInit');
  				peer.on('signal',(data) => {
  					const obj = {
  						// roomName:zw,
  						data:data
  					}
  					socket.emit('Answer',obj)
  				})
  				peer.signal(offer);
  			}

  			function signalAnswer(answer) 
  			{
  				client.gotAnswer = true;
  				let peer:Peer = <Peer>client.peer
  				peer.signal(answer)
  			}

  			function CreateVideo(stream)
  			{
  				let othervideo = this.otherVideo.nativeElement;
  				othervideo.src = URL.createObjectURL(stream);
  				this.peersrc = othervideo.src;
  				othervideo.play();
  			}

  			function SessionActive() 
  			{
  				console.log("User Busy");
  			}
  			function CallOver()
  			{
  				stream.getTracks().forEach(function(track) {
				  track.stop();
				});
  			} 
  			socket.on('BackOffer',getAnswer);
  			socket.on('BackAnswer', signalAnswer);
  			socket.on('callOver',CallOver);
  			socket.on('CreatePeer',makePeer);

  		},function(err){
    console.log('Failed to get stream', err);
    });
  	}
  }
  endCall() 
  {
  	this.socket.emit('disconnect',this.roomName);
  	this.dialogRef.close();
  	this.snackBar.open("Call over","close",{duration:2000});
  }
}

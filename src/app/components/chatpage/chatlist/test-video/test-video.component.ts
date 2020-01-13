import { Component, OnInit, ViewChild } from '@angular/core';
import * as Peer from 'simple-peer';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-test-video',
  templateUrl: './test-video.component.html',
  styleUrls: ['./test-video.component.css']
})
export class TestVideoComponent implements OnInit {

@ViewChild('myVideo') myVideo:any;
@ViewChild('otherVideo') otherVideo : any;
socket = io('http://localhost:4000');
n = <any>navigator;

  constructor() { }

  ngOnInit() {
  	let socket = io('http://localhost:4000');
  	let video = this.myVideo.nativeElement;
  	let othervideo = this.otherVideo.nativeElement;
  	let client = {
		gotAnswer:false,
		peer:""
	};
  	this.n.mediaDevices.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
  	if(this.n.mediaDevices.getUserMedia)
  	{
  		this.n.getUserMedia({video:true,audio:true},function (stream){
  			socket.emit('NewClient');
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
  				return peer
  			}  

  			function makePeer()
  			{
  				client.gotAnswer = false;
  				let peer = initPeer('init');
  				peer.on('signal',function(data) {
  					if(!client.gotAnswer){
  						socket.emit('Offer',data);
  					}
  				})
  				client.peer = peer;
  			}

  			function getAnswer(offer)
  			{
  				let peer = initPeer('notInit');
  				peer.on('signal',(data) => {
  					socket.emit('Answer',data)
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
  				othervideo.src = URL.createObjectURL(stream);
  				othervideo.play();
  			}

  			function SessionActive() 
  			{
  				console.log("User Busy");
  			}

  			socket.on('BackOffer',getAnswer);
  			socket.on('BackAnswer', signalAnswer);
  			socket.on('SessionActive',SessionActive);
  			socket.on('CreatePeer',makePeer);

  		},function(err){
    console.log('Failed to get stream', err);
    });
  	}
  }


}

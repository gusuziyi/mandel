
var rmax=1.2,rmin=-2.2,imax=1.2,imin=-1.2;
var escape=128,maxiter=127;

window.onload=init;
function init(){
	window.onresize=initCanvas;
	var resetButton=document.getElementById("reset");
	resetButton.onclick=reset;
	var canvas=document.getElementById("canvas");
	canvas.onclick=function(event){
		roomIn(event.clientX,event.clientY);
	};
	initCanvas();
	
}
function reset(){
	rmax=1.2,rmin=-2.2,imax=1.2,imin=-1.2;
	mandel();
}
function roomIn(x,y){
	var room=1.5;
	var mandelX=rmin+(rmax-rmin)*x/window.innerWidth;
	var mandelY=imin+(imax-imin)*y/window.innerHeight;
	var width = (rmax-rmin)/2;
	var height = (imax-imin)/2;
	rmax=mandelX+width/room;
	rmin=mandelX-width/room;
	imax=mandelY+height/room;
	imin=mandelY-height/room;
	mandel();

}
function initCanvas(){
	var canvas=document.getElementById("canvas");
	var canvas2d=canvas.getContext("2d");
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight;
	canvas2d.fillStyle="rgb(0,0,0)";
	canvas2d.fillRect(0,0,canvas.width,canvas.height);
	mandel();
}
function mandel(){
	var canvas=document.getElementById("canvas");
	var canvas2d=canvas.getContext("2d");
	var rowData=canvas2d.createImageData(window.innerWidth,1);
	var rowDataLength=rowData.data.length/4;
	var width=(imax-imin)*window.innerWidth/window.innerHeight;
	var rmid=(rmax+rmin)/2;
	rmin=rmid-width/2;
	rmax=rmid+width/2;

		var taskInfo={
			row:0,
			ci:0,
			cr:0,
			maxiter:maxiter,
			rmax:rmax,
			rmin:rmin,
			imax:imax,
			imin:imin,
			rowDataLength:rowDataLength,
			canvasWidth:window.innerWidth,
			escapeArray:[]
		};
		initWorker(taskInfo);// result is escapeArray
	
}

function initWorker(taskInfo){
	var workerNum=4;
	var workers=[];
		for (var i = 0; i < workerNum; i++){
			var worker = new Worker("scripts/worker.js");
			worker.idle=true;
			workers.push(worker);
			worker.onmessage=function (event){
				drawRow(event.data.escapeArray,event.data.row);
				event.target.idle=true;
			};
		}
		while (taskInfo.row!=window.innerHeight) {
			var ci=imin+(imax-imin)*taskInfo.row/(window.innerHeight);
			taskInfo.ci=ci;
			getIdleWorker(workers,taskInfo);
		 	
		 } 
}
	


function getIdleWorker(workers,taskInfo){
	for (var i = 0; i < workers.length; i++) {
		if(workers[i].idle==true){
			workers[i].idle==false;
			workers[i].postMessage(taskInfo);
			taskInfo.row+=1;
		}
	}

}

function drawRow(escapeArray,row){
	var canvas=document.getElementById("canvas");
	var canvas2d=canvas.getContext("2d");
	var rowData=canvas2d.createImageData(window.innerWidth,1);
	for (var i = 0; i < escapeArray.length; i++) {
			var red=4*i;
			var green=4*i+1;
			var blue=4*i+2;
			var alpha=4*i+3;
			if(escapeArray[i]<maxiter){
				//is  escape
				var color=Math.floor(escapeArray[i]*255/maxiter);
				rowData.data[red]=color;
				rowData.data[green]=color;
				rowData.data[blue]=color;
				rowData.data[alpha]=255; 
			}else if(escapeArray[i]==maxiter){
				 var color=Math.floor(maxiter*Math.random());
				 rowData.data[red]=200;
				 rowData.data[green]=color;
				 rowData.data[blue]=50;
				 rowData.data[alpha]=255;
			}
		}
	canvas2d.putImageData(rowData, 0, row);
}
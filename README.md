从八月底开始自学js，到今天下午完全凭自己绘出mandelbrot，获得了极大地成就感，学习进步的速度连自己都吃了一惊，看起来只要认真，还是有回报的。

mandelbrot的难点在于：
**1.运算量极为庞大，动辄使服务器崩溃**
解决办法：将图像分解成数百行，平均分配给四个CPU同时计算，极大提高了稳定性和速度。
关键函数：function initWorker(taskInfo){
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

**2.M集与直角坐标系不同步的问题**
解决办法：定义了“距离的像素长度”概念，不仅能正确在电脑上显示，还解决了缩放的问题
关键函数：function roomIn(x,y){
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

**3.对逃逸次数的捕获**
解决办法：对M集复平面上的任意值c=a+bi进行逐点运算，对逃逸点赋予随机灰度escapeArray[i]* 255/maxiter，对黑洞点赋予随机噪点（200，maxiter*Math.random()，50）
关键函数：for (var i = 0; i < taskInfo.rowDataLength; i++) { 
	 	var zN=new ComplexNum(0,0);
		var cr=taskInfo.rmin+(taskInfo.rmax-taskInfo.rmin)*i/(taskInfo.canvasWidth);
		taskInfo.cr=cr;
		var constC=new ComplexNum(taskInfo.cr,taskInfo.ci);
                for (var j = 0; j < taskInfo.maxiter; j++) {
			var multResult= complexMult(zN,zN);
			zN=complexAdd(multResult,constC);
			if(mod(zN)>2){//is escape
				taskInfo.escapeArray.push(j);
				break;
			}
		}

			if(j==taskInfo.maxiter)//not escape   push maxiter used to color select
				taskInfo.escapeArray.push(taskInfo.maxiter);
	}

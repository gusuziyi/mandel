
onmessage=calculate;
// onmessage=test;

function ComplexNum(real,illus){
	this.real=real;
	this.illus=illus;

}
function complexAdd(complexA,complexB){
	var complexResult=new ComplexNum();
	complexResult.real=complexA.real+complexB.real;
	complexResult.illus=complexA.illus+complexB.illus;
	return complexResult;
}

function complexMult(complexA,complexB){
	var complexResult=new ComplexNum();
	complexResult.real=complexA.real*complexB.real-complexA.illus*complexB.illus;
	complexResult.illus=complexA.real*complexB.illus+complexA.illus*complexB.real;
	return complexResult;
}
function mod(complex){
	var temp=complex.real*complex.real+complex.illus*complex.illus;
	var result=Math.sqrt(temp);
	return result;
}

function test(){

	var zN=new ComplexNum(1,2);
	var z2=new ComplexNum(1,2);
	var multResult=new ComplexNum(0,0);
	multResult=complexMult(zN,zN);
	postMessage(multResult);

}
/* var taskInfo={
		row:0,
		ci:0,
		cr:0,
		maxiter:maxiter,
		rmax:rmax,
		rmin:rmin,
		imax:imax,
		imin:imin,
		rowDataLength:0,
		canvasWidth:window.innerWidth,
		escapeArray:[]
	};*/
function calculate(event){
	var worker=event.target;
	var taskInfo=event.data;
	for (var i = 0; i < taskInfo.rowDataLength; i++) { 
	 	var zN=new ComplexNum(0,0);
		var cr=taskInfo.rmin+(taskInfo.rmax-taskInfo.rmin)*i/(taskInfo.canvasWidth);
		taskInfo.cr=cr;
		var constC=new ComplexNum(taskInfo.cr,taskInfo.ci);

/*		var c_re=taskInfo.cr, c_im = taskInfo.ci;
		var z_re = c_re, z_im = c_im;
		var z_re2 =0,z_im2 =0;
		for (var j = 0; j < taskInfo.maxiter; j++) {
			
			 z_re2 = z_re*z_re;
			 z_im2 = z_im*z_im;
			 if(z_re2 + z_im2 > 4)
                {
                    taskInfo.escapeArray.push(j);
                    break;
                }

                z_im = 2*z_re*z_im + c_im;
                z_re = z_re2 - z_im2 + c_re;

		}*/
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
	postMessage(taskInfo);
}


		
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
	complexResult.illus=complexA.real*complexB.illus+complexA.illus*complexB.illus;
	return complexResult;
}
function mod(complex){
	var temp=complex.real*complex.real+complex.illus*complex.illus;
	var result=Math.sqrt(temp);
	return result;
}


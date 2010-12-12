function Monitors(){
alpha=null;
display=null;
win=null;
cat= null;
id= null;
ready= false;
stream=false;
grad=null;
style='grad';
sX=null;
sY=null;
transX=null;
transY=null;
rot=null;
cputime=null;
proctime=null;
cpuperI=null;
memperI=null;
cpuperII=null;
memperII=null;
cpuperIII=null;
memperIII=null;
counterI=null;
counterII=null;
updateTime=3000;
linesX=null;
linesY=null;
frameColor=null;
frameWidth=null;
frameJoin=null;
myLineColor=null;
myLineWidth=null;
myLineJoin=null;
back=null;

labelM=null;
labelMX=null;
labelMY=null;
calcX=null;
calcY=null;
transXT=null;
transYT=null;
sXT=null;
sYT=null;
rotT=null;
textColor=null;
textFont=null;
visible=null;
level=null;
service=null;
engineType=null;
}

Monitors.prototype.getServiceUuid = function(proc) {
        FEMhub.RPC.Engine.identify({uuid: proc}, function(result) {
           this.service=result.uuid;
        }, this);
},

Monitors.prototype.initialize = function(Vdisplay, Vcat, Vid){
this.display=Vdisplay;
this.cat=Vcat;
this.id=Vid;
this.ready=true;
this.sX=1;
this.sY=1;
this.transX=30;
this.transY=30;
this.alpha=0.5;
this.rot=0;
this.style='grad';
this.grad=new Array(3);
this.grad[0]='#ff0000';
this.grad[1]='#f0ff00';
this.grad[2]='#36ff00';
this.linesX=10;
this.linesY=30;

this.updateTime=2000;

this.cputime=new Array(30);
   this.proctime=new Array(30);
   this.cpuperI=new Array(30);
   this.cpuperII=new Array(30);
   this.cpuperIII=new Array(30);
      var i=0;
   for (i=0;i<=30;i++)
      {
      this.cputime[i]=0;
      this.proctime[i]=0;
      this.cpuperI[i]=0;
	  this.cpuperII[i]=0;
	  this.cpuperIII[i]=0;
      }


this.memperI=new Array(30);
this.memperII=new Array(30);
this.memperIII=new Array(30);
   var i=0;
   for (i=0;i<=30;i++)
      {
      this.memperI[i]=0;
	  this.memperII[i]=0;
	  this.memperIII[i]=0;
      }

this.counterI=0;
this.counterII=0;
this.frameColor='grey';
this.frameWidth=2;
this.frameJoin='round';
this.myLineColor='blue';
this.myLineWidth=1;
this.myLineJoin='miter';
this.gridXColor='brown';
this.gridXWidth=1;
this.gridYColor='brown';
this.gridYWidth=1;
this.back='black';
this.service=0;
this.labelM='CPU';
this.labelMX=10;
this.labelMY=10;
this.calcX=50;
this.calcY=10;
this.transXT=340;
this.transYT=20;
this.sXT=1;
this.sYT=1;
this.rotT=0;
this.textColor='black';
this.textFont='12px sans-serif';

this.level=1;
this.visible=false;
this.engineType='';

},

Monitors.prototype.getInfo = function(){

}



Monitors.prototype.setTranslate = function(x,y){
this.transX=x;
this.transY=y;
this.transform=false;
},

Monitors.prototype.setScale = function(x,y){
this.scaleX=x;
this.scaleY=y;
this.transform=false;
},

Monitors.prototype.setSize = function(x,y){
this.scaleX=parseInt(x/302);
this.scaleY=parseInt(y/202);
this.transform=false;
},

Monitors.prototype.setRotation = function(r){
this.rot=r;
this.transform=false;
},

Monitors.prototype.start = function(){
if (this.ready==true){
   var thisObj=this;
   setInterval(function() {thisObj.timedCount()},updateTime);
   }
},

Monitors.prototype.timedCount = function(){
if (this.ready==true){
this.getStats();
if (this.visible==true){
this.drawStats();
this.printStats();
}
}
},

Monitors.prototype.getStats = function(){

FEMhub.RPC.Engine.stat({uuid: this.id}, function(result) {
   
                if (result.ok == true) {
                    this.stream=true;
			
			if (this.service==0){
			this.getServiceUuid(this.id);
			}
                        
                            this.cputime.shift();
                            this.proctime.shift();
                            this.cpuperI.shift();
                            this.cputime.push(result.cpu.system);
                            this.proctime.push(result.cpu.user);
                            var z =parseInt((this.proctime[29]-this.proctime[28])/(this.cputime[29]-this.cputime[28]));
                            if (isNaN(z))
                            {
                                z=0;
                            }
                            this.cpuperI.push(z);
                        
                            this.memperI.shift();
                            this.memperI.push(result.memory.percent);
                        	
						this.counterI+=1;
						if (this.counterI>=30){
						this.cpuperII.shift();
						this.memperII.shift();
						this.cpuperII.push(this.average('cpu',1));
						this.memperII.push(this.average('mem',1));
						this.counterII+=1;
						if (this.counterII>=30){
							this.cpuperIII.shift();
							this.memperIII.shift();
							this.cpuperIII.push(this.average('cpu',2));
							this.memperIII.push(this.average('mem',2));
							this.counterII=0;
							}
						this.counterI=0;
						}
                    }
                else{
               // FEMhub.msg.warning(display, "Error with obtaining engine stats.");
                }
                }, this );

},

Monitors.prototype.average = function(type, level){
var x=0;
if (level==1){
if (type=='mem'){
	for (i=0;i<30;i++){
		x=x+this.memperI[i];
		}
	x=x/30;
	}
if (type=='cpu'){
	for (i=0;i<30;i++){
		x=x+this.cpuperI[i];
		}
	x=x/30;
	}	
}
if (level==2){
if (type=='mem'){
	for (i=0;i<30;i++){
		x=x+this.memperII[i];
		}
	x=x/30;
	}
if (type=='cpu'){
	for (i=0;i<30;i++){
		x=x+this.cpuperII[i];
		}
	x=x/30;
	}	
}
return x;
},

Monitors.prototype.printStats = function(){
    var drawingCanvas = document.getElementById(this.display);
    var context = drawingCanvas.getContext('2d');
    var dtArray;
    if (this.level ==1){
		if (this.cat=='cpu'){
			dtArray=this.cpuperI;
			}
		if (this.cat=='mem'){
			dtArray=this.memperI;
			}
		}
	if (this.level ==2){
		if (this.cat=='cpu'){
			dtArray=this.cpuperII;
			}
		if (this.cat=='mem'){
			dtArray=this.memperII;
			}
		}
	if (this.level ==3){
		if (this.cat=='cpu'){
			dtArray=this.cpuperIII;
			}
		if (this.cat=='mem'){
			dtArray=this.memperIII;
			}
		}
	context.save();
	
	context.translate(this.transXT,this.transYT);
	context.scale(this.sXT,this.sYT);
	context.rotate(this.rotT);
	context.clearRect(0,0,200,10);
	context.strokeStyle=this.textColor;
	context.font=this.textFont;
	context.save();
	context.strokeText(this.labelM,this.labelMX,this.labelMY);
	context.strokeText('Python',this.labelMX,this.labelMY+20);
	//context.strokeText(parseInt(dtArray[29])+'%',this.calcX,this.calcY);
	context.restore();
	context.restore();
}

Monitors.prototype.drawStats = function() {
    var drawingCanvas = document.getElementById(this.display);
    var context = drawingCanvas.getContext('2d');
    var dtArray;
	if (this.level ==1){
		if (this.cat=='cpu'){
			dtArray=this.cpuperI;
			}
		if (this.cat=='mem'){
			dtArray=this.memperI;
			}
		}
	if (this.level ==2){
		if (this.cat=='cpu'){
			dtArray=this.cpuperII;
			}
		if (this.cat=='mem'){
			dtArray=this.memperII;
			}
		}
	if (this.level ==3){
		if (this.cat=='cpu'){
			dtArray=this.cpuperIII;
			}
		if (this.cat=='mem'){
			dtArray=this.memperIII;
			}
		}
	//transformations
	context.save();
	context.translate(this.transX,this.transY);
	context.scale(this.sX,this.sY);
	context.rotate(this.rot);
	context.globalAlpha=this.alpha;
	context.clearRect(0,0,400,220);
	context.save();
   


        
    context.strokeStyle = "#000000";
    context.fillStyle = "#FFFF00";
   
   
    
    //Frame
    context.strokeStyle =this.frameColor;
    context.lineWidth=this.frameWidth;
    context.lineJoin=this.frameJoin;
    context.strokeRect(0,0,302,202);
    //Background
    context.fillStyle = this.back;
    context.fillRect(1,1,300,200);
    context.save();
    
    //Gradient
    if (this.style=='grad'){
	//Mask
    context.beginPath();
    context.moveTo(0,201);
    for (x=0;x<=30;x++)
        {
	var t=0;
        t=dtArray[x];
        context.lineTo(10*(x)+1,201-(t*2));

        }
    context.lineTo(302,202);
    context.lineTo(1,201);
    context.closePath();
    
    context.clip();
    context.save();
	//Gradient fill
    context.beginPath();
    var gradD=context.createLinearGradient(0,1,0,201);
   
	
    for (x=0;x<this.grad.length;x++){
    gradD.addColorStop((1/(this.grad.length-1))*x,this.grad[x]);
    }
    context.fillStyle=gradD;
    context.fillRect(1,1,300,200);
    context.closePath();
    context.save();
    }
    if(this.style=='grad'){
    context.restore();
    context.restore();
   context.restore();
	}
    //Line
    if (this.style=='line'){
    context.beginPath();
    context.strokeStyle=this.myLineColor;
    context.lineWidth=this.myLineWidth;
    context.lineJoin=this.myLineJoin;

    context.moveTo(1,201-(dtArray[0]*2));
   
    for (x=1;x<=30;x++)
        {
	var t;
        t=dtArray[x];
        context.lineTo(10*(x)+1,201-(t*2));

        }
    context.moveTo(302,202);
    context.moveTo(1,201);
    context.closePath();
    context.stroke();
    context.save();


    }
    
    


   
    //Grid
    if (this.linesY>0){
	context.beginPath();
	context.strokeStyle=this.gridYColor;
	context.lineWidth=this.gridYWidth;
	for (y=0;y<this.linesY;y++){
	context.moveTo(y*parseInt(300/this.linesY)+1,201);
	context.lineTo(y*parseInt(300/this.linesY)+1,1);
	}
	
	
	context.stroke();
	context.save();
    }

    if (this.linesX>0){
	context.beginPath();
	context.strokeStyle=this.gridXColor;
	context.lineWidth=this.gridXWidth;
	for (x=0;x<this.linesX;x++){
	context.moveTo(1,x*parseInt(200/this.linesX)+1);
	context.lineTo(301,x*parseInt(200/this.linesX)+1);
	}
	
	context.stroke();
	context.save();
    }

	context.strokeStyle=this.textColor;
	context.font=this.textFont;
	context.textBaseline='top';
	context.save();
	var numbers=0;
	context.strokeText('0%',304,201);
	for (i=this.linesX;i>0;i--){
		numbers+=parseInt(100/(this.linesX));
		context.strokeText(numbers+'%',304,(i-1)*parseInt(200/this.linesX)+1);
	}

	numbers=0;
	//context.strokeText('0',301,215);
	for (i=(this.linesY)/6;i>0;i--){
	if (this.level==1){
	numbers-=12;
	context.strokeText(numbers+'s',6*(i-1)*parseInt(300/this.linesY)+1,203);
	}
	if (this.level==2){
	numbers-=6;
	context.strokeText(numbers+'min',6*(i-1)*parseInt(300/this.linesY)+1,203);
	}
	if (this.level==3){
	numbers-=3;
	context.strokeText(numbers+'h',6*(i-1)*parseInt(300/this.linesY)+1,203);
	}
		
		
	}

	context.restore();





	if (this.linesX>0){
	context.restore();
	}
	if (this.linesY>0){
	context.restore();
	}
	
    context.restore();
    context.restore();

    context.restore(); 
	context.restore();
    },

   
   
Monitors.prototype.setGrad = function(grad) {
this.grad=grad;
},
   
Monitors.prototype.setStyle = function(style) {
this.style=style;
},

Monitors.prototype.setDisplay = function(Vdisplay) {
this.display=Vdisplay;
},

Monitors.prototype.setCategory = function(Vcat) {
this.cat=Vcat;
this.labelM=this.cat;
},

Monitors.prototype.setId = function(Vid) {
this.id=Vid;
},

Monitors.prototype.setUpdateTime = function(time) {
this.updateTime=time;
},

Monitors.prototype.stop = function() {
this.ready=false;
},

Monitors.prototype.setAlpha = function(alpha) {
this.alpha=alpha;
this.transform=false;
},

Monitors.prototype.setVisible = function(visible) {
this.visible=visible;
},

Monitors.prototype.setLevel = function(level) {
this.level=level;
},

Monitors.prototype.setEngineType = function(engine) {
this.engineType=engine;
}

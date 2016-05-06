
 var FigureControlTest;
 var testCount=0;
 var canvas_HTML;
 var context_HTML;

(function int(){	
    canvas_HTML=document.getElementById('canvas');
    context_HTML=canvas_HTML.getContext('2d');
	
	FigureControlTest=new FigureControl;	
	FigureControlTest.InitFigureControl();
	FigureControlTest.InitFigureControlFromFile(context_HTML,canvas_HTML,"3.bmp",FigureControlTest);	
	
	
})();


/*
canvas.onmousedown=function(event){
	    
    var pos=windowToCanvas(canvas,event.clientX,event.clientY);
    
	//鼠标按下左键
	canvas.onmousemove=function(event){
        canvas.style.cursor="move";
        var pos1=windowToCanvas(canvas,event.clientX,event.clientY);
        var x=pos1.x-pos.x;
        var y=pos1.y-pos.y;
        pos=pos1;
        imgX+=x;
        imgY+=y;
        drawImage();
    }
	
	
	//鼠标松开左键
    canvas.onmouseup=function(){
        canvas.onmousemove=null;
        canvas.onmouseup=null;
        canvas.style.cursor="default";
    }
}
*/





//图像缩放,最大缩放40倍
/*
canvas.onmousewheel=canvas.onwheel=function(event){
    var pos=windowToCanvas(canvas,event.clientX,event.clientY);
    //alert(event.clientX+"-"+event.clientY+"-"+event.wheelDelta);
    
    //event.wheelDelta=event.wheelDelta?event.wheelDelta:(event.deltaY*(-40));  
    
    if(event.wheelDelta>0){
        imgScale*=ZoomRate;
        imgX=imgX*ZoomRate-pos.x;
        imgY=imgY*ZoomRate-pos.y;
    }else{
        imgScale/=ZoomRate;
        imgX=imgX*(1/ZoomRate)+pos.x*(1/ZoomRate);
        imgY=imgY*(1/ZoomRate)+pos.y*(1/ZoomRate);
    }
    drawImage();
}
*/
/*
function windowToCanvas(canvas,x,y){
    var bbox = canvas.getBoundingClientRect();
    
    return {
        x:x - bbox.left - (bbox.width - canvas.width) / ZoomRate,
        y:y - bbox.top - (bbox.height - canvas.height) / ZoomRate
    };
}
*/
function InitFromImageFromFile(imageName)
{
	LoadImageName=imageName;
	loadImg(imageName);
}

function InitFromBuffer(imageData,height,width)
{

}
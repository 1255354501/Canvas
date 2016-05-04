//defines
// figureTypes
var LineType=0,PolyType=1,RectType=2,DrectType=3,CircleType=4;


//Color Types

var NormalColor="rgb(255,255,255)",GreenColor="rgb(0,255,0)",RedColor="rgb(255,0,0)",YelloColor="rgb(255,255,0)";

var MaxCPointCount=50;
var MaxFigureCount=50,FigureControl_ReservedLen=100;

var  FigureControl_ScaleBot=0.94;			//缩放系数
var  FigureControl_FitZoomRate =0.05;
var  FigureControl_Radius =3	;			//原点半径
var  FigureControl_ShowPointRadius = 2   ;//显示原点半径
var FigureControl_TextLength =175	;		//图形名称显示长度
var  FigureControl_DoubleRectDistance =15 ; //双方框间距
var  FigureControl_PointRectDistance= 10  ; //小方框大小
var  FigureControl_CrossSize= 10	;		//标记点大小 
var  FigureControl_MaxSelectFigureNum= 10 ; 
var  FigureControl_UserMessageMenu =10000;
var  FigureControl_MaxZoomScale=  -80;
var  FigureControl_ReservedLen	=256;


//Common Functions--------------------------------

function PointEqual(PointA,PointB)
{
	PointA.x=PointB.x;
	PointA.y=PointB.y;
}
 
function PointInCurrentRect(rect,point)
{
	if (point.x>=rect.left && point.x<=rect.right && point.y>=rect.top && point.y<=rect.bottom)
	{
		return true;
	}
	else
	{
		return false;
	}
}


function GetIntValue(fdata)
{
	if (fdata >=0)
	{
		return parseInt(fdata+0.5);
	}
	else
		return parseInt(fdata-0.5);
}

function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}

function  cloneObj(obj){
    /*var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;*/
	 var result,oClass=isClass(obj);
        //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(key in obj){
        var copy=obj[key];
        if(isClass(copy)=="Object"){
            result[key]=arguments.callee(copy);//递归调用
        }else if(isClass(copy)=="Array"){
            result[key]=arguments.callee(copy);
        }else{
            result[key]=obj[key];
        }
    }
    return result;
}

function  maxValue(a,b)
{
	return a>b?a:b;
}


function minValue(a,b)
{
	return a<b?a:b;
}



//Cpoint Crect Defines-----------------------------------------------------------------------------

function CPoint(x,y)
{
	this.x=x;
	this.y=y;
}

function Width()
{
	return this.right-this.left;
}

function Height()
{
	return this.bottom-this.top;
}

function GetCenter()
{
	var CenterPoint=new CPoint(0,0);
	CenterPoint.x=this.left+GetIntValue(this.Width()/2.0);
	CenterPoint.y=this.top+GetIntValue(this.Height()/2.0);
	return CenterPoint;
}

function CRect(left,top,right,bottom)
{
	this.left=left;
	this.top=top;
	this.right=right;
	this.bottom=bottom;
	
	this.Width=Width;
	this.Height=Height;
	this.GetCenter=GetCenter;
}



//FillFigure-----------------------------------------------------

function FillFigure(b_fill,figure_color,FillStyle)
{
	this.b_fill=b_fill;
	this.figure_color=figure_color;
	this.FillStyle=FillStyle;
}


//figure_data-----------------------------------------------------

function AddCPoint(point)
{
	this.m_CPoint[this.nCPointCount].x=point.x;
	this.m_CPoint[this.nCPointCount].y=point.y;
	this.nCPointCount++;
}

function InsertPoint(CPointId,point)
{
	if(CPointId>0 && CPointId<MaxCPointCount)
	{		
		this.nCPointCount++;
		var index=this.nCPointCount;
		
		for(index;index>CPointId;index--)
		{
			this.m_CPoint[index]=this.m_CPoint[Index-1];
		}
		
		this.m_CPoint[CPointId].x=point.x;
		this.m_CPoint[CPointId].y=point.y;
		
		return true;
	}	
	return false;
}


function eraseCPoint(CPointId)
{
	var index=CPointId;
	if(index>0 && index<MaxCPointCount)
	{
		for(index;index<this.nCPointCount;index++)
		{
			this.m_CPoint[index]=this.m_CPoint[Index+1];
		}
		this.nCPointCount--;
		return true;
	}
	else
		return false;	
}

function ClearData()
{
	for(var n=0;n<MaxCPointCount;n++)
	{
		this.m_CPoint[n].x=0;
		this.m_CPoint[n].y=0;
	}	
	this.nCPointCount=0;
}


function figure_data()
{
	this.m_CPoint=new Array(MaxCPointCount);
	for(var Index=0;Index<MaxCPointCount;Index++)
		this.m_CPoint[Index]=new CPoint(0,0);
	
	this.nCPointCount=0;
	
	this.AddCPoint=AddCPoint;	
	this.ClearData=ClearData;
	this.eraseCPoint=eraseCPoint;
	this.InsertPoint=InsertPoint;
}



// figure------------------------------------------------------------------------
function MoveFigure(x,y)
{
	this.shift_x+=x;
	this.shift_y+=y;
}


function DistanceToData(zoomData,Ftype)
{
	if (Ftype==DrectType)
	{
		this.figure_rect.left+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.right+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.top+=GetIntValue(this.shift_y/zoomData);
		this.figure_rect.bottom+=GetIntValue(this.shift_y/zoomData);

		this.figure_rect_outside.left+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect_outside.right+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect_outside.top+=GetIntValue(this.shift_y/zoomData);
		this.figure_rect_outside.bottom+=GetIntValue(this.shift_y/zoomData);
	}
	else if (Ftype==CircleType)
	{
		this.figure_rect.left+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.right+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.top+=GetIntValue(this.shift_y/zoomData);
		this.figure_rect.bottom+=GetIntValue(this.shift_y/zoomData);
	}
	else
	{
		var GetIndex=0;
		for (GetIndex;GetIndex<this.figure_data.nCPointCount;GetIndex++)
		{			
			this.figure_data.m_CPoint[GetIndex].x=this.figure_data.m_CPoint[GetIndex].x
			+GetIntValue(this.shift_x/zoomData);
			
			this.figure_data.m_CPoint[GetIndex].y=this.figure_data.m_CPoint[GetIndex].y
			+GetIntValue(this.shift_y/zoomData);
		}  
		if (Ftype==RectType)
		{
			this.figure_rect.left+=GetIntValue(this.shift_x/zoomData);
			this.figure_rect.right+=GetIntValue(this.shift_x/zoomData);
			this.figure_rect.top+=GetIntValue(this.shift_y/zoomData);
			this.figure_rect.bottom+=GetIntValue(this.shift_y/zoomData);
		}
	}

	this.shift_x=0;
	this.shift_y=0;
}




function ClearFigureData()
{
	this.figure_data.ClearData();	
	this.figure_rect.left=0;
	this.figure_rect.right=0;
	this.figure_rect.top=0;
	this.figure_rect.bottom=0;
	this.figure_rect_outside.left=0;
	this.figure_rect_outside.right=0;
	this.figure_rect_outside.top=0;
	this.figure_rect_outside.bottom=0;
	this.figure_id=0;
	this.TransRate=0;
	this.figure_name="";
	this.shift_x=0;
	this.shift_y=0;
	this.TransRate=0;
	this.figure_fill.b_fill=false;
	this.bShowSqure=false;
	this.bOutsideFigure=false;
}



function Figure()
{
	this.figure_type=LineType;
	this.figure_color=NormalColor;
	this.figure_id=0;
	this.figure_name=null;
	this.figure_rect=new CRect(0,0,0,0);
	this.figure_rect_outside=new CRect(0,0,0,0);
	this.shift_x=0;
	this.shift_y=0;
	this.figure_color="rgb(0,255,0)";
	this.figure_fill=new Array(MaxCPointCount);	
	for(var Index=0;Index<MaxCPointCount;Index++)
		this.figure_fill[Index]=new FillFigure(false,NormalColor,0);
		
	this.TransRate=100;   //图形透明度 0-100
	this.bShowSqure=true;
	this.bOutsideFigure=false;
	//图像数据
	this.figure_data=new figure_data;
	
	//function
	this.MoveFigure=MoveFigure;
	this.DistanceToData=DistanceToData;
	this.ClearFigureData=ClearFigureData;
}




//FiguresSet-----------------------------------------
function AddFigure(figure)
{
	this.m_Figures[this.m_nFigureCount]=cloneObj(figure);
	this.m_nFigureCount++;
}

function ClearFigureSetData()
{
	for(var n=0;n<MaxFigureCount;n++)
	{
		this.m_Figures[n].ClearData();
	}	
	this.m_nFigureCount=0;
}

function FiguresSet()
{
	//attibutes
	this.m_Figures=new Array(MaxCPointCount);	
	
	for(Index=0;Index<50;Index++)
	this.m_Figures[Index]=new Figure();
	
	this.m_nFigureCount=0;
	//operations
	this.AddFigure=AddFigure;	
	this.ClearFigureSetData=ClearFigureSetData;
}

//CFigureRect---------------------------------------
function CFigureRect()
{
	this.m_nFigureID=0;
	this.m_FigureRect=new CRect(0,0,0,0);
}



function AddFiguretRect(figureRect)
{
	this.m_FigureRect[this.m_nFigureRectCount]=cloneObj(figureRect);;
	this.m_nFigureRectCount++;
}

function ClearFigureRectData()
{
	for(var n=0;n<MaxFigureCount;n++)
	{
		this.m_FigureRect[n].left=0;
		this.m_FigureRect[n].top=0;
		this.m_FigureRect[n].right=0;
		this.m_FigureRect[n].bottom=0;
	}	
	this.m_nFigureRectCount=0;
}

function FiguresRectSet()
{
//attibutes
	this.m_FigureRect=new Array(MaxCPointCount);
	for(var Index=0;Index<MaxCPointCount;Index++)
		this.m_FigureRect[Index]=new CFigureRect();
		
	this.m_nFigureRectCount=0;
//operations	
	this.AddFiguretRect=AddFiguretRect;	
	this.ClearFigureRectData=ClearFigureRectData;
}











//IMG_OBJ------------------------------------------------------

function SetValue(nImageType,nImageHeight,nImageWidth,pData,nEncoder)
{
	this.m_imgType=nImageType;
	this.m_nImgHeight=nImageHeight;
	this.m_nImgWidth=nImageWidth;
	this.m_pImgBuf=pData;
	this.m_nEncoder=nEncoder;
}




function IMG_OBJ()
{
	this.m_nBufSize=0;
	this.m_imgType=0;
	this.m_nImgHeight=0;
	this.m_nImgWidth=0;
	this.m_nImgWidthBytes=0;
	
	this.m_nEncoder=0;
	this.m_pImgBuf=null;
	
//functions
   this.SetValue=SetValue;	
}


function getBrowserPosition(element)
{ 
	var t=element.offsetTop; 
	var l=element.offsetLeft; 
	var w=element.offsetWidth;
	var h=element.offsetHeight;
	while(element=element.offsetParent)
	{ 
		t+=element.offsetTop; 
		l+=element.offsetLeft; 
	} 
	
	var Rect=new CRect(l,t,l+w,t+h);
	return Rect;
}























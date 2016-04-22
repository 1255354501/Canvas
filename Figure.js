//defines
// figureTypes
var LineType=0,PolyType=1,RectType=2,DrectType=3,CircleType=4;


//Color Types

var NormalColor=0,GreenColor=1,RedColor=2,YelloColor=3;

var MaxCPointCount=50;
var MaxFigureCount=50,FigureControl_ReservedLen=100;

var  FigureControl_ScaleBot=0.94;			//缩放系数
var  FigureControl_FitZoomRate =0.05;
var  FigureControl_Radius =3	;			//原点半径
var  FigureControl_ShowPointRadius = 2   ;//显示原点半径
var FigureControl_TextLength =175	;		//图形名称显示长度
var  FigureControl_DoubleRectDistance =15 ; //双方框间距
var  FigureControl_PointRectDistance= 3  ; //小方框大小
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
//Cpoint Crect Defines-----------------------------------------------------------------------------

function CPoint(x,y)
{
	this.x=x;
	this.y=y;
}

function CRect(left,top,right,bottom)
{
	this.left=left;
	this.top=top;
	this.right=right;
	this.bottom=bottom;
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
	this.this.figure_rect.left=0;
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
	
	this.figure_fill=new Array(MaxCPointCount);
	
	for(var Index=0;Index<MaxCPointCount;Index++)
		this.figure_fill[Index]=new FillFigure(false,NormalColor,0);
		
	this.TransRate=100;   //图形透明度 0-100
	this.bShowSqure=true;
	
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
	this.m_Figures[this.m_nFigureCount]=figure;
	this.m_nFigureCount++;
}

function ClearFigureSetData()
{
	for(var n=0;n<MaxFigureCount;n++)
	{
		this.m_Figures[n].ClearData();
	}	
}

function FiguresSet()
{
	//attibutes
	this.m_Figures=new Array(MaxCPointCount);	
	
	for(Index=0;Index<50;Index++)
	this.m_Figures[Index]=new Figure();
	
	this.m_nFigureCount=0;
	//operations
	this.AddFiguret=AddFigure;	
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
	this.m_Figures[this.m_nFigureCount]=figure;
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

























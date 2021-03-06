
//FigureCntrol internal Functinos---------------------------------------------------------------
function InitFigureControl()  //初始化控件参数
{
	this.m_fZoomNum=1;  //图形放大倍数   
	this.m_cpCurrentPoint_cursor.x=0;  //当前鼠标位置
	this.m_cpCurrentPoint_cursor.y=0;
	this.m_cpOriginalPoint_cursor.x=0;  //最近一次鼠标左键点击的位置
	this.m_cpOriginalPoint_cursor.y=0;
	this.m_cpDistancePoint.x=0;         //左键点击鼠标后偏移的位置
	this.m_cpDistancePoint.y=0;
	this.OriginalPoint_Bitmap.x=0;//50;    //坐标原点位置
	this.OriginalPoint_Bitmap.y=0;//10; 
	this.m_MovePoint_cursor.x=0;   //当前鼠标移动到的位置
	this.m_MovePoint_cursor.y=0; 
	this.b_SubFiguresMove=true;  //是否移动图形形
	this.b_SubFiguresZoom=false;    //释放缩放图形 
	this.b_LButtonDouC=false;   //是否还处于左键双击状态
	this.m_CurrentDistance.x=0;  //坐标平移距离
	this.m_CurrentDistance.y=0;
	this.m_nFigureCount=0;   //图形个数
	this.m_nCursorInFigureId=0;  //鼠标所在图形ID
	this.SelectFigureId=0;
	this.m_nNextFigureIndex=0;
	this.b_DrawCircle=false;
	this.b_DrawDoubleRect=false;
	this.b_DrawPoly=false;
	this.b_DrawRect=false;
	this.b_PreDrawRect=false;   //准备绘制方框
	this.b_PreDrawCircle=false;
	this.b_PreDrawDoubleRect=false;  
	this.b_FigurePointSelect=false;
	this.m_nScrollRate=0;
	this.CurrentFigure.shift_x=0;
	this.CurrentFigure.shift_y=0;
	this.m_CurrentFillStyle=0;
	this.b_ChangeFigureValue=false; 
	this.m_PositionLabel.x=0;
	this.m_PositionLabel.y=0;
	this.b_InitShiftToCenter=true;
	this.b_ShowPositionLabel=false;
	this.b_LeftButtonDown=false;
	this.b_LoadData=false;
	this.b_ChangeFigureSize=true;
	this.b_ChooseDRectType=false;
	this.m_RectFigure.top=0;
	this.m_RectFigure.bottom=0;
	this.m_RectFigure.right=0;
	this.m_RectFigure.left=0;  
	this.m_ClientRect.top=0;
	this.m_ClientRect.bottom=0;
	this.m_ClientRect.left=0;
	this.m_ClientRect.right=0;
	this.x_Distance=0;
	this.y_Distance=0;
	this.b_ProcessImageFromDc=false;
	this.b_CursorInOutSide=true;
	this.m_bRGBBufferFill=false;
	this.b_ShowPointRect=true;
	this.b_MoveAllFigures=false;
	
	if (this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0)
	{
		this.m_SelectSubFigureRectIdSet.ClearFigureRectData();
	}
	if (this.m_TempLinesPointSet.nCPointCount>0)
	{
		this.m_TempLinesPointSet.ClearData();
	}
	if (this.m_FiguresSet.m_nFigureCount>0)
	{
		this.m_FiguresSet.ClearFigureSetData();
	}
	
	this.m_CurrentImageObject.m_pImgBuf=null; 
	this.m_TransparentBackgroundColor=0;
	this.m_nControlWidth=0;
	this.m_nControlHeight=0;
	this.FinishDrawNotice=null;
	this.m_csCurrentDrawFigureName="";
	this.m_OutsideLineColor="rgb(255,255,255)";
	this.b_ShowOutSideLine=false;	
	
	return true;  
} 


function RepaintControl() //控件重绘  CPaintDC*
{
	if(this.b_LoadData==false)
	{
		return;
	} 
	
	this.m_Context.clearRect(0,0,this.m_Canvas.width,this.m_Canvas.height);

	this.m_RectFigure.left=0;
	this.m_RectFigure.right=this.m_Image.width;
	this.m_RectFigure.top=0;
	this.m_RectFigure.bottom=this.m_Image.height; 

  this.m_Context.drawImage(this.m_Image,0,0,this.m_Image.width,this.m_Image.height,
	this.OriginalPoint_Bitmap.x,this.OriginalPoint_Bitmap.y,
	this.m_Image.width*this.m_fZoomNum,
	this.m_Image.height*this.m_fZoomNum);

//图像大小框
	this.DrawOutSideLine();

//此处显示图像上层的各种图形形   
	if (this.m_FiguresSet.m_nFigureCount>0)
	{ 
		var FindIterator=new Figure ; 
		for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
		{  
			this.DrawFigure(this.m_FiguresSet.m_Figures[index]); 
		} 
	}  
//画实时正在画的线条 
	this.drawTempLines();  


//显示其他图形信息
	this.ShowOtherFigures();

  
	
	
}

// FigureData
function ConnectLine(data) //有线组成的图形形连线
{
	var MovePoint=new CPoint(0,0);
	var In_OriginalPoint_cursor=new CPoint(0,0); 
	PointEqual(MovePoint,this.OriginalPoint_Bitmap);  
	var nCurrentPointIndex=0,nPointIndex=0;
//移动到起始点
	var FindIterator=new CPoint(0,0);
	if (data.figure_data.nCPointCount==0)
	{
		return;
	}	
	FindIterator=data.figure_data.m_CPoint[0];
	nCurrentPointIndex++;
	
	//显示第一个小方框
	if ((data.figure_id==this.m_nCursorInFigureId || data.figure_id== this.SelectFigureId) && this.b_ShowPointRect)
	{
		var point=new CPoint(0,0);
		point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
		point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
		this.DrawPointRect(point,0);				
	} 
	this.m_Context.strokeStyle =data.figure_color;
	this.m_Context.beginPath();
	this.m_Context.moveTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);  
	this.m_Context.stroke();
	
	if (data.figure_type==RectType)
	{
		data.figure_rect.left=FindIterator.x;
		data.figure_rect.top=FindIterator.y;
	}
//显示图形名
	var rect=new CRect(0,0,0,0);
	this.m_Context.strokeStyle =data.figure_color;
	
	rect.left=5+GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
	rect.right=rect.left+FigureControl_TextLength;
	rect.top=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
	rect.bottom=rect.top+FigureControl_TextLength;
	
	
	this.m_Context.fillText(data.figure_name,rect.left,rect.top); 
	
//对所有点连线	 	
	nPointIndex++;
	var TempColorNum=0;
	for (nPointIndex;nPointIndex<data.figure_data.nCPointCount;nPointIndex++)
	{ 
		FindIterator=data.figure_data.m_CPoint[nPointIndex];
		if (nCurrentPointIndex==3)
		{
			data.figure_rect.right=FindIterator.x;		
			data.figure_rect.bottom=FindIterator.y;
		}
		//连线
		this.m_Context.strokeStyle =data.figure_color;
		this.m_Context.lineTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,
		GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);
		this.m_Context.stroke();		
	}
	FindIterator=data.figure_data.m_CPoint[0];	
	this.m_Context.strokeStyle =data.figure_color;
	this.m_Context.lineTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,
	GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);
	this.m_Context.stroke();
	
	
	nPointIndex=1;
	//显示小方框 
	for (nPointIndex;nPointIndex<data.figure_data.nCPointCount;nPointIndex++)
	{ 
		FindIterator=data.figure_data.m_CPoint[nPointIndex];
 		nCurrentPointIndex++;		
		if (nCurrentPointIndex==3)
		{
			data.figure_rect.right=FindIterator.x;		
			data.figure_rect.bottom=FindIterator.y;
		}		
		if ((data.figure_id==this.m_nCursorInFigureId  || data.figure_id== this.SelectFigureId)  && this.b_ShowPointRect)
		{  
			var point=new CPoint(0,0);
			point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
			point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
			this.DrawPointRect(point,(++TempColorNum)%2);

			if (data.figure_type==RectType && !data.bShowSqure)
			{
				if (nCurrentPointIndex==2)
				{
					point.x=GetIntValue((FindIterator.x-data.figure_rect.Width()/2.0)*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);
				}
				if (nCurrentPointIndex==3)
				{
					point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue((FindIterator.y-data.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);
				}			
				
				if (nCurrentPointIndex==4)
				{
					point.x=GetIntValue((FindIterator.x+data.figure_rect.Width()/2.0)*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);

					point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue((FindIterator.y-data.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);
				}
				
			}
		} 		
	}
	
	
	
	
	if ((data.figure_id==this.m_nCursorInFigureId  || data.figure_id== this.SelectFigureId)
		 && this.b_LeftButtonDown && data.figure_type==RectType && data.bShowSqure)
	{
		var pt=new CPoint(GetIntValue(data.figure_rect.right*this.m_fZoomNum+MovePoint.x+data.shift_x-
		(data.figure_rect.right-data.figure_rect.left)*this.m_fZoomNum/2.0),
			GetIntValue(data.figure_rect.bottom*this.m_fZoomNum+MovePoint.y+data.shift_y-
			(data.figure_rect.bottom-data.figure_rect.top)/2.0*this.m_fZoomNum));
			
		this.DrawPointRect(pt,2);
	}	
	
}


function DrawFigure(data)//绘制图形
{
	//填充图形
	this.FillFigureRect(data);
	//图形周边线条
	if (data.figure_type==CircleType)
	{
		this.DrawEllipseRect(data);
	}
	else if (data.figure_type==DrectType)
	{
		this.DrawDoubleRect(data);
	}
	else
	{
		this.ConnectLine(data); 
	}
}


function FillFigureRect(data) //填充图形 
{
	if (data.figure_fill.b_fill==true)
	{ 
	//填充多边形
		if (data.figure_type==PolyType ||data.figure_type==RectType)
		{
			var PointCount=data.figure_data.m_nFigureRectCount();
			var points=new Array(PointCount);
			for(var n=0;n<PointCount;n++)
				points[n]=new CPoint(0,0);
			
			var FindIterator=new CPoint(0,0);
			var FindPointIndex=0;
			var i=0;
			for (;FindPointIndex < PointCount;FindPointIndex++)
			{
				FindIterator=data.figure_data.m_CPoint[FindPointIndex]
				
				points[i].x=GetIntValue(FindIterator.x*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
				points[i].y=GetIntValue(FindIterator.y*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y; 
				i++;
			}
		
		
			this.m_Context.fillStyle=data.figure_fill.figure_color;
			
			//int oldrop2=cdc.SetROP2(data.figure_fill.FillStyle);
			//cdc.Polygon(points,PointCount); 
			//cdc.SetROP2(oldrop2);  
		 
		} 
		//填充圆形
		else if (data.figure_type==CircleType)
		{  			
			var TempFillRect=new CRect(0,0,0,0);
			TempFillRect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.top=GetIntValue(data.figure_rect.top*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;
			TempFillRect.bottom=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;
			
			var xPostion=TempFillRect.left+(TempFillRect.right-TempFillRect.left)/2.0;
			var YPostion=TempFillRect.top+(TempFillRect.bottom-TempFillRect.top)/2.0;
			
			this.m_Context.fillStyle=data.figure_fill.figure_color;		
			
			this.m_Context.arc(GetIntValue(xPostion),GetIntValue(YPostion),
			GetIntValue((TempFillRect.right-TempFillRect.left)/2.0),
			0, Math.PI * 2,false); 
			
		} 
		else if (data.figure_type==DrectType)
		{
			var TempFillRect=new CRect(0,0,0,0);
			TempFillRect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.top=GetIntValue(data.figure_rect.top*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;
			TempFillRect.bottom=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;
			var points=new Array(4);
			for(var i=0;i<4;i++)
				points[i]=new CPoint(0,0);
			points[0].x=TempFillRect.left;
			points[0].y=TempFillRect.top;
			points[1].x=TempFillRect.right;
			points[1].y=TempFillRect.top;
			points[2].x=TempFillRect.right;
			points[2].y=TempFillRect.bottom;
			points[3].x=TempFillRect.left;
			points[3].y=TempFillRect.bottom;
			
			this.m_Context.fillStyle=data.figure_fill.figure_color;
		}
	} 	
	return;
}


function drawTempLines()  //实时显示正在画的线条
{
	if (this.m_TempLinesPointSet.nCPointCount==0)
	{
		return;
	}  
	//list<CPoint >::iterator FindIterator;
	var FindIterator=new CPoint(0,0);
	var FindPointIndex=0;
	
	FindIterator=this.m_TempLinesPointSet.m_CPoint[FindPointIndex];
		
	this.m_Context.beginPath();
	this.m_Context.fillStyle = "green";
	this.m_Context.arc(FindIterator.x,FindIterator.y,FigureControl_Radius,Math.PI * 2,false);
	this.m_Context.moveTo(FindIterator.x,FindIterator.y); 
	
	
	FindIterator=this.m_TempLinesPointSet.m_CPoint[++FindPointIndex];
	
	this.m_Context.fillStyle = "rgb(255,255,0)";
	
	for (FindPointIndex;FindPointIndex<this.m_TempLinesPointSet.nCPointCount;FindPointIndex++)
	{
		FindIterator=this.m_TempLinesPointSet.m_CPoint[FindPointIndex];
		
		this.m_Context.lineTo(FindIterator.x,FindIterator.y);  
	}
	this.m_Context.stroke();
}

function DrawOutSideLine() //图像外围框 
{}

function InSubFigureRect(point,beginPoint,endPoint)//点是否在直接指定范围内
{
	var k=0.0;//直线斜率
	if (endPoint.x-beginPoint.x!=0)
	{
		k=((endPoint.y-beginPoint.y)*1.0/(endPoint.x-beginPoint.x));
	}
	else
		k=0;
	var y=GetIntValue((k*(point.x-endPoint.x)))+endPoint.y;
	if ( y>=point.y && point.x>=minValue(endPoint.x,beginPoint.x)  && point.x<maxValue(endPoint.x,beginPoint.x)) 
	{
		return true;
	} 
	else
	{
		return false;
	}
}

function InEllipseRect(rect,point)//点是否在圆区域内
{
	var a=0.0,b=0.0, x0=0.0,y0=0.0; 
	//椭圆焦点在X轴上
	if (rect.Width()>=rect.Height())
	{
		a=maxValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		b=minValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		x0=GetIntValue(rect.right-rect.Width()/2.0);  
		y0=GetIntValue(rect.bottom-rect.Height()/2.0); 
		var tempvalue=0.0;
		tempvalue=Math.pow(b,2)-Math.pow(b/a,2)*Math.pow((point.x-x0),2);
		if (tempvalue<0)
		{
			return false;
		}
		tempvalue=Math.pow(tempvalue,0.5);
		var y1=0.0,y2=0.0;
		y1=y0+tempvalue;
		y2=y0-tempvalue;
		if ((y1>=point.y&& y2<=point.y) || (y1<=point.y && y2>=point.y))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else//椭圆焦点在Y轴上
	{
		a=maxValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		b=minValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		x0=GetIntValue((rect.right-rect.Width()/2.0));  
		y0=GetIntValue((rect.bottom-rect.Height()/2.0)); 
		var tempvalue=0.0;
		tempvalue=Math.pow(a,2)-Math.pow(a/b,2)*Math.pow((point.x-x0),2);
		if (tempvalue<0)
		{
			return false;
		}
		tempvalue=Math.pow(tempvalue,0.5);
		var y1=0.0,y2=0.0;
		y1=y0+tempvalue;
		y2=y0-tempvalue;
		if ((y1>=point.y&& y2<=point.y) || (y1<=point.y && y2>=point.y))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

function DrawRect(rect)//绘方框区域
{	
	this.m_Context.beginPath();
	this.m_Context.moveTo(rect.left,rect.top);
	this.m_Context.lineTo(rect.right,rect.top);
	this.m_Context.lineTo(rect.right,rect.bottom);
	this.m_Context.lineTo(rect.left,rect.bottom);
	this.m_Context.lineTo(rect.left,rect.top);	
	this.m_Context.stroke();
}

function DrawEllipseRect(data)//绘圆
{
	var rect=new CRect(0,0,0,0);
	rect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.top=GetIntValue(data.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	rect.bottom=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	
	
	var x=rect.GetCenter().x;
	var y=rect.GetCenter().y;
	var a=rect.Width()/2.0;
	var b=rect.Height()/2.0;
 	
    var r = (a > b) ? a : b;
    var ratioX = a / r;
    var ratioY = b / r;
   
  	this.m_Context.save();
    this.m_Context.scale(ratioX, ratioY);
    this.m_Context.beginPath();
	this.m_Context.strokeStyle =data.figure_color;
    this.m_Context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
	this.m_Context.stroke();
    //this.m_Context.closePath();
    this.m_Context.restore();
    //this.m_Context.fill();

	
	//绘小方框
	if ((data.figure_id==this.m_nCursorInFigureId || data.figure_id== this.SelectFigureId)&& this.b_ShowPointRect)
	{
		var point=new CPoint(0,0);
		point.x=rect.left+GetIntValue((rect.right-rect.left)/2);
		point.y=rect.top;
		this.DrawPointRect(point,0); 
		point.x=rect.right;
		point.y=rect.top+GetIntValue((rect.bottom-rect.top)/2);
		this.DrawPointRect(point,1); 
		point.x=rect.left+GetIntValue((rect.right-rect.left)/2);
		point.y=rect.bottom;
		this.DrawPointRect(point,0); 
		point.x=rect.left;
		point.y=rect.top+GetIntValue((rect.bottom-rect.top)/2);
		this.DrawPointRect(point,1);
	}
	//显示图形名
	///*
	var ShowNameRect=new CRect(0,0,0,0);
	ShowNameRect.left=rect.left+5;
	ShowNameRect.top=rect.top+GetIntValue((rect.bottom-rect.top)/2.0)-5;
	ShowNameRect.right= ShowNameRect.left+FigureControl_TextLength;
	ShowNameRect.bottom=ShowNameRect.top+FigureControl_TextLength;
	
	this.m_Context.fillText(data.figure_name,ShowNameRect,ShowNameRect.left,
	ShowNameRect.top);
}

function DrawDoubleRect(data)//绘双方框
{
	var rect=new CRect(0,0,0,0);
	var rect_outside=new CRect(0,0,0,0);
	rect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.top=GetIntValue(data.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	rect.bottom=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;

	rect_outside.left=GetIntValue(data.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect_outside.right=GetIntValue(data.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect_outside.top=GetIntValue(data.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	rect_outside.bottom=GetIntValue(data.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	
	this.m_Context.fillStyle = data.figure_color;
	this.DrawRect(rect);
	this.DrawRect(rect_outside); 

//显示小方框
	if ((data.figure_id==this.m_nCursorInFigureId  || data.figure_id== this.SelectFigureId)&&  this.b_ShowPointRect)
	{
		var point=new CPoint(0,0);
		point.x=rect.left;
		point.y=rect.top;
		this.DrawPointRect(point,0);
		point.x=rect.right;
		point.y=rect.top;
		this.DrawPointRect(point,1);
		point.x=rect.right;
		point.y=rect.bottom;
		this.DrawPointRect(point,0);
		point.x=rect.left;
		point.y=rect.bottom;
		this.DrawPointRect(point,1);

		point.x=rect_outside.left;
		point.y=rect_outside.top;
		this.DrawPointRect(point,1);
		point.x=rect_outside.right;
		point.y=rect_outside.top;
		this.DrawPointRect(point,0);
		point.x=rect_outside.right;
		point.y=rect_outside.bottom;
		this.DrawPointRect(point,1);
		point.x=rect_outside.left;
		point.y=rect_outside.bottom;
		this.DrawPointRect(point,0);
	}  
//显示图形名	 
	rect.right=rect.left+FigureControl_TextLength; 
	rect.bottom=rect.top+FigureControl_TextLength;
	
	this.m_Context.fillText(data.figure_name,rect.left,rect.top); 
}
 
 function SelectSubFigureRectSet(pt) //确定当前点所在的区域范围集合 BOOL
{
	//此处显示图像上层的各种选择框   
	if (this.m_FiguresSet.m_nFigureCount==0)
	{
		return false;
	}
	var MovePoint=new CPoint(0,0);
	var In_OriginalPoint_cursor=new CPoint(0,0);  
	PointEqual(MovePoint,this.OriginalPoint_Bitmap); 
	PointEqual(In_OriginalPoint_cursor,this.m_cpOriginalPoint_cursor);
	var LinePointBegin=new CPoint(0,0);
	var LinePointEnd=new CPoint(0,0);
	var Iterator=new Figure;
	var FigureIndex=0;	
	for(FigureIndex;FigureIndex<this.m_FiguresSet.m_nFigureCount;FigureIndex++)
	{   
		Iterator=this.m_FiguresSet.m_Figures[FigureIndex];
		var PointInRect=0;  
		if (Iterator.figure_type==DrectType)
		{
			var rect=new CRect(0,0,0,0);
			var rect_outside=new CRect(0,0,0,0);
			rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
			rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;

			rect_outside.left=GetIntValue(Iterator.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect_outside.right=GetIntValue(Iterator.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect_outside.top=GetIntValue(Iterator.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
			rect_outside.bottom=GetIntValue(Iterator.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
 
			if (In_OriginalPoint_cursor.x>=rect_outside.left  
				&&In_OriginalPoint_cursor.x<=rect_outside.right 
				&& In_OriginalPoint_cursor.y>=rect_outside.top 
				&& In_OriginalPoint_cursor.y<=rect_outside.bottom)
			{
				var CurrentFigure=new CFigureRect;
				CurrentFigure.m_nFigureID = Iterator.figure_id;
				CurrentFigure.m_FigureRect = Iterator.figure_rect_outside;
				this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
			}	
			var CornerPoint=new Array(8);
			for(var index=0;index<8;index++)
				CornerPoint[index]=new CPoint(0,0);
			CornerPoint[0].x=rect.left;
			CornerPoint[0].y=rect.top;
			CornerPoint[1].x=rect.right;
			CornerPoint[1].y=rect.top;
			CornerPoint[2].x=rect.right;
			CornerPoint[2].y=rect.bottom;
			CornerPoint[3].x=rect.left;
			CornerPoint[3].y=rect.bottom;
			CornerPoint[4].x=rect_outside.left;
			CornerPoint[4].y=rect_outside.top;
			CornerPoint[5].x=rect_outside.right;
			CornerPoint[5].y=rect_outside.top;
			CornerPoint[6].x=rect_outside.right;
			CornerPoint[6].y=rect_outside.bottom;
			CornerPoint[7].x=rect_outside.left;
			CornerPoint[7].y=rect_outside.bottom;
			for (var i=0;i<8;i++)
			{
				if (PointInPointRect(In_OriginalPoint_cursor,CornerPoint[i]))
				{
					var CurrentFigure=new CFigureRect;
					CurrentFigure.m_nFigureID = Iterator.figure_id;
					CurrentFigure.m_FigureRect = Iterator.figure_rect_outside;
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
					return true;
					//break;
				}
			}
		}
		else if (Iterator.figure_type==CircleType)
		{
			var rect=new CRect;
			rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
			rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;

			if (InEllipseRect(rect,In_OriginalPoint_cursor))
			{
				var CurrentFigure=new CFigureRect;
				CurrentFigure.m_nFigureID = Iterator.figure_id;
				CurrentFigure.m_FigureRect = Iterator.figure_rect;
				this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
			}
			var CornerPoint=new Array(4);
			for(var index=0;index<4;index++)
				CornerPoint[index]=new CPoint(0,0);
				
			CornerPoint[0].x=rect.left+rect.Width()/2;
			CornerPoint[0].y=rect.top;
			CornerPoint[1].x=rect.right;
			CornerPoint[1].y=rect.top+rect.Height()/2;
			CornerPoint[2].x=rect.left+rect.Width()/2;
			CornerPoint[2].y=rect.bottom;
			CornerPoint[3].x=rect.left;
			CornerPoint[3].y=rect.top+rect.Height()/2;
			for (var i=0;i<4;i++)
			{
				if (PointInPointRect(In_OriginalPoint_cursor,CornerPoint[i]))
				{
					var CurrentFigure=new CFigureRect;
					CurrentFigure.m_nFigureID = Iterator.figure_id;
					CurrentFigure.m_FigureRect = Iterator.figure_rect;
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
					return true;
					//break;
				}
			}

		}
		else
		{
			
			if (Iterator.figure_data.nCPointCount>0)  //只计算由点连接组成的图形
			{ 
				var FindIterator=new CPoint(0,0);
				var FindIndex=0;				
				FindIterator=Iterator.figure_data.m_CPoint[FindIndex]; 
				LinePointBegin.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+Iterator.shift_x;
				LinePointBegin.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+Iterator. shift_y;
				var nCurrentPointIndex=0;
				var CenterPoint=new CPoint(0,0);
				for (FindIndex;FindIndex<Iterator.figure_data.nCPointCount;FindIndex++)
				{
					nCurrentPointIndex++;
					FindIterator=Iterator.figure_data.m_CPoint[FindIndex]; 
					//计算是否与投影相连
					LinePointEnd.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+Iterator.shift_x;
					LinePointEnd.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+Iterator.shift_y;  
					if (this.InSubFigureRect(In_OriginalPoint_cursor,LinePointBegin,LinePointEnd))
					{
						PointInRect++;
					} 
					LinePointBegin.x=LinePointEnd.x;
					LinePointBegin.y=LinePointEnd.y;

					var CornerPoint=new CPoint(0,0);
					CornerPoint.x=LinePointEnd.x;
					CornerPoint.y=LinePointEnd.y;
					
					if(Iterator.figure_type==RectType)
					{
						switch(nCurrentPointIndex)
						{
						case 1:
							CenterPoint.x=GetIntValue((FindIterator.x+Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+
								MovePoint.x+Iterator.shift_x;
							CenterPoint.y=LinePointEnd.y;
							break;
						case 2:
							CenterPoint.x=LinePointEnd.x;
							CenterPoint.y=GetIntValue((FindIterator.y+Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y
								+Iterator.shift_y;  
							break;
						case 3:
							CenterPoint.x=GetIntValue((FindIterator.x-Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+
								MovePoint.x+Iterator.shift_x; 
							CenterPoint.y=LinePointEnd.y;
							break;
						case 4:
							CenterPoint.x=LinePointEnd.x;
							CenterPoint.y=GetIntValue((FindIterator.y-Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y
								+Iterator.shift_y;  
						default:
							break;
						}					
						if (this.PointInPointRect(In_OriginalPoint_cursor,CenterPoint))
						{
							var CurrentFigure=new CFigureRect;
							CurrentFigure.m_nFigureID = Iterator.figure_id;
							this.GetFigureOutsideRect(CurrentFigure.m_FigureRect, Iterator);
							this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
							return true;
							//break;
						}
					}
					if (this.PointInPointRect(In_OriginalPoint_cursor,CornerPoint))
					{
						var CurrentFigure=new CFigureRect;
						CurrentFigure.m_nFigureID = Iterator.figure_id;
						this.GetFigureOutsideRect(CurrentFigure.m_FigureRect, Iterator);
						this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
						return true;
						//break;
					}
				}
				//最后一条边
				FindIterator=Iterator.figure_data.m_CPoint[0];
				LinePointEnd.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+Iterator.shift_x;
				LinePointEnd.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+Iterator.shift_y; 
				
				if (this.InSubFigureRect(In_OriginalPoint_cursor,LinePointBegin,LinePointEnd))
				{
					PointInRect++;
				}  
				//存入当前鼠标点所在区域的集合队列
				if (PointInRect%2==1)
				{ 
					var CurrentFigure=new CFigureRect;
					CurrentFigure.m_nFigureID = Iterator.figure_id;
					this.GetFigureOutsideRect(CurrentFigure.m_FigureRect, Iterator);
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
					//break;
				}	

				var CornerPoint=new CPoint(0,0);
				CornerPoint.x=LinePointEnd.x;
				CornerPoint.y=LinePointEnd.y;				

				if (this.PointInPointRect(In_OriginalPoint_cursor,CornerPoint))
				{
					var CurrentFigure=new CFigureRect;
					CurrentFigure.m_nFigureID = Iterator.figure_id;
					this.GetFigureOutsideRect(CurrentFigure.m_FigureRect, Iterator);
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(CurrentFigure);
					return true; 
					//break;
				}
				PointInRect=0;
			}
		} 
	}
	return true;
}

function DrawPointRect(point,ColorId)  //绘点方框
{
	var rect=new CRect(0,0,0,0);
	rect.left=point.x-FigureControl_PointRectDistance;
	rect.right=point.x+FigureControl_PointRectDistance;
	rect.top=point.y-FigureControl_PointRectDistance;
	rect.bottom=point.y+FigureControl_PointRectDistance; 
	
	if (ColorId==0)
	{
		this.m_Context.fillStyle = "yellow";
		this.m_Context.strokeStyle = "yellow";
	}
	else if (ColorId==1)
	{
		this.m_Context.fillStyle = "red";
		this.m_Context.strokeStyle = "yellow";
	} 
	else if (ColorId==2)
	{
		this.m_Context.fillStyle = "white";
		this.m_Context.strokeStyle = "yellow";
	}	
	this.DrawRect(rect);
}

function PointGoOutSide(point)  //当前点是否已经超出图片移动范围
{
	if(point.x<this.OriginalPoint_Bitmap.x || point.y<this.OriginalPoint_Bitmap.y)
	{ 
		return true;
	}
	if ( point.x>this.OriginalPoint_Bitmap.x+this.m_RectFigure.Width()*this.m_fZoomNum 
	|| point.y>this.OriginalPoint_Bitmap.y+this.m_RectFigure.Height()*this.m_fZoomNum)
	{	 
		return true;
	}  
	return false;
}

function PointInPointRect(pt,rect_point)  //A点是否在B点区域范围内
{
	var rect=new CRect(0,0,0,0);
	var RectSize=FigureControl_PointRectDistance;
	rect.left=rect_point.x-RectSize;
	rect.right=rect_point.x+RectSize;
	rect.top=rect_point.y-RectSize;
	rect.bottom=rect_point.y+RectSize;
	if (PointInRect(pt,rect))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function PointInRect(point ,rect)  //点是否在方框区域内
{
	if (point.x>=rect.left && point.x<=rect.right && point.y>=rect.top && point.y<=rect.bottom)
	{
		return true;
	}	 
	else
		return false;
}

function PointInRectEdge(point,rect,num)// 点是否在方框边缘区域内
{
	if (point.x<=rect.left && point.y<=rect.top && num==LeftTop)
	{
		return true;
	}
	else if (point.x>=rect.right && point.y<=rect.top && num==RightTop)
	{
		return true;
	}
	else if (point.x>=rect.right && point.y>=rect.bottom && num==RightBottom)
	{
		return true;
	}
	else if (point.x<=rect.left && point.y>=rect.bottom&& num==LeftBottom)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function LoadFromFile(BmpPath) //从文件导入
{}

function LoadFromBuffer(IMG_OBJ) // 从Buffer导入	
{}


function SearchPoint()			//在图形集里面寻找当前鼠标点的近邻 
{
	var In_OriginalPoint_cursor=new CPoint(0,0);  //当前鼠标所在位置
	PointEqual(In_OriginalPoint_cursor,this.m_cpOriginalPoint_cursor);
	var Iterator=new   Figure;
	var nFigureIndex=0;
	for(nFigureIndex;nFigureIndex<this.m_FiguresSet.m_nFigureCount;nFigureIndex++)
	{
		 //确定单签选中点
		 Iterator=this.m_FiguresSet.m_Figures[nFigureIndex];
		if (Iterator.figure_id==this.m_nCursorInFigureId)
		{
			if (Iterator.figure_type==DrectType)
			{
				var rect=new CRect(0,0,0,0);
				var rect_outside=new CRect(0,0,0,0);
				rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y; 
				rect_outside.left=GetIntValue(Iterator.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect_outside.right=GetIntValue(Iterator.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect_outside.top=GetIntValue(Iterator.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				rect_outside.bottom=GetIntValue(Iterator.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y; 
				var pt=new Array(9);
				for (var nPt=0;nPt<9;nPt++)
					pt[nPt]=new CPoint(0,0); 
				pt[1].x=rect.left;
				pt[1].y=rect.top;
				pt[2].x=rect.right;
				pt[2].y=rect.top;
				pt[3].x=rect.right;
				pt[3].y=rect.bottom;
				pt[4].x=rect.left;
				pt[4].y=rect.bottom;
				pt[5].x=rect_outside.left;
				pt[5].y=rect_outside.top;
				pt[6].x=rect_outside.right;
				pt[6].y=rect_outside.top;
				pt[7].x=rect_outside.right;
				pt[7].y=rect_outside.bottom;
				pt[8].x=rect_outside.left;
				pt[8].y=rect_outside.bottom; 
				for (var i=1;i<=8;i++)
				{
					if (this.PointInPointRect(In_OriginalPoint_cursor,pt[i]))
					{
						this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
						this.CurrentSelectPoint.Figure_point.x=GetIntValue((pt[i].x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
						this.CurrentSelectPoint.Figure_point.y=GetIntValue((pt[i].y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
						this.CurrentSelectPoint.nPointIndex=i;
						//已经找到该点，返回 
						this.b_FigurePointSelect=true;
						return; 
					}
					else
					{
						this.b_FigurePointSelect=false;
					}

				} 
			}
			else if (Iterator.figure_type==CircleType)
			{
				var rect=new CRect(0,0,0,0);
				rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y; 
				var pt=new Array(5);
				for (var nPt=0;nPt<5;nPt++)
					pt[nPt]=new CPoint(0,0); 
				pt[1].x=rect.left+GetIntValue(((rect.right-rect.left)/2));
				pt[1].y=rect.top; 
				pt[2].x=rect.right;
				pt[2].y=rect.top+GetIntValue(((rect.bottom-rect.top)/2)); 
				pt[3].x=rect.left+GetIntValue(((rect.right-rect.left)/2));
				pt[3].y=rect.bottom; 
				pt[4].x=rect.left;
				pt[4].y=rect.top+GetIntValue(((rect.bottom-rect.top)/2)); 
				for (var i=1;i<=4;i++)
				{
					if (PointInPointRect(In_OriginalPoint_cursor,pt[i]))
					{
						this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
						this.CurrentSelectPoint.Figure_point.x=GetIntValue((pt[i].x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
						this.CurrentSelectPoint.Figure_point.y=GetIntValue((pt[i].y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
						//已经找到该点，返回 
						this.b_FigurePointSelect=true;
						this.CurrentSelectPoint.nPointIndex=i;
						return;

					}
					else
					{
						this.b_FigurePointSelect=false;
					}
				}
			}
			else if (Iterator.figure_type==PolyType || Iterator.figure_type==RectType)
			{				
				var FindIterator=new CPoint(0,0);
				var nPointIndex=0;
				var centerPoint=new CPoint(0,0);
				var nFindPointIndex=0;
				for (nFindPointIndex;nFindPointIndex<Iterator.figure_data.nCPointCount;nFindPointIndex++)
				{
					FindIterator=Iterator.figure_data.m_CPoint[nFindPointIndex];
					nPointIndex++;
					var pt=new CPoint(0,0); 
					
					pt.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
					pt.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;

					centerPoint.x=pt.x;
					centerPoint.y=pt.y;
					if (nPointIndex<=4 && Iterator.figure_type==RectType)
					{
						switch(nPointIndex)
						{
						case 1:
							centerPoint.x=GetIntValue((FindIterator.x+Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
							break;
						case 2:
							centerPoint.y=GetIntValue((FindIterator.y+Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
							break;
						case 3:
							centerPoint.x=GetIntValue((FindIterator.x-Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
							break;
						case 4:
							centerPoint.y=GetIntValue((FindIterator.y-Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
							break;
						default:
							break;
						}
						if (this.PointInPointRect(In_OriginalPoint_cursor,centerPoint))
						{ 
							this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
							this.CurrentSelectPoint.Figure_point.x=centerPoint.x;
							this.CurrentSelectPoint.Figure_point.y=centerPoint.y;
							this.CurrentSelectPoint.nPointIndex=nPointIndex+4;
							this.b_FigurePointSelect=true;
							//已经找到该点，返回
							return; 
						}
					}

					if (this.PointInPointRect(In_OriginalPoint_cursor,pt))
					{ 
						this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
						this.CurrentSelectPoint.Figure_point.x=FindIterator.x;
						this.CurrentSelectPoint.Figure_point.y=FindIterator.y;
						this.b_FigurePointSelect=true;
						this.CurrentSelectPoint.nPointIndex=nPointIndex;
						//已经找到该点，返回
						return; 
					} 
					else
					{
						this.b_FigurePointSelect=false;
					}
				}
			}
		}
		else
		{
			this.b_FigurePointSelect=false;
		}
	}
}

function SetFillStyle(nIndex) //设置填充风格
{}

function GetFillStyle(nIndex)		//获取填充风格；
{}

function ShowOtherFigures()  //显示剩余的一些图形形
{}

function setInitZoomScale(num)				// 初始缩放比率，放大的，为负数
{
	num=-num;
	this.m_nScrollRate=GetIntValue(num*10);
	if (num>0)
	{   //最大放大倍率
		if (num<-60)
		{
			return false;
		} 
		this.m_fZoomNum= Math.pow(FigureControl_ScaleBot,this.m_nScrollRate);  
		this.m_ImageHeight=this.m_ClientRect.height*this.m_fZoomNum;
		this.m_ImageWeith=this.m_ClientRect.width*this.m_fZoomNum;
		this.m_OldImageWeith=this.m_ClientRect.width*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1);
		this.m_OldImageHeight=this.m_ClientRect.height*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1);
		this.m_CurrentDistance.x=GetIntValue((this.m_ImageWeith-this.m_OldImageWeith)/2);
		this.m_CurrentDistance.y=GetIntValue((this.m_ImageHeight-this.m_OldImageHeight)/2);
		this.OriginalPoint_Bitmap.x=(this.OriginalPoint_Bitmap.x-this.m_CurrentDistance.x); 
		this.OriginalPoint_Bitmap.y=(this.OriginalPoint_Bitmap.y-this.m_CurrentDistance.y);

	} 
	else 
	{	  
		if (num>60)
		{
			return false;
		} 
		this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate); 
		this.m_ImageHeight=this.m_ClientRect.height*this.m_fZoomNum;
		this.m_ImageWeith=this.m_ClientRect.width*this.m_fZoomNum; 
		this.m_OldImageWeith=this.m_ClientRect.width*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1);
		this.m_OldImageHeight=this.m_ClientRect.height*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1);
		this.m_CurrentDistance.x=-GetIntValue((this.m_OldImageWeith-this.m_ImageWeith)/2);
		this.m_CurrentDistance.y=-GetIntValue((this.m_OldImageHeight-this.m_ImageHeight)/2);
		this.OriginalPoint_Bitmap.x=(this.OriginalPoint_Bitmap.x-this.m_CurrentDistance.x);
		this.OriginalPoint_Bitmap.y=(this.OriginalPoint_Bitmap.y-this.m_CurrentDistance.y);
	}     
	this.RepaintControl(); 
	return true;
}

function ProcessMaskImage(int ,int)  //显示Mask图形 
{}

function ShiftImageToCenter()  //初始图像居中 
{
	var temp_x=0,temp_y=0;   
	temp_x=GetIntValue((this.m_ClientRect.width-this.m_Image.width*this.m_fZoomNum)/2);
	temp_y=GetIntValue((this.m_ClientRect.height-this.m_Image.height*this.m_fZoomNum)/2);
	this.OriginalPoint_Bitmap.x=temp_x;
	this.OriginalPoint_Bitmap.y=temp_y; 
	this.m_nControlWidth=temp_x;
	this.m_nControlHeight=temp_y;
	this.RepaintControl();
}

function FinishDraw(nIndex)
{}

function  AlignWidthBytes(nBytes)
{}




function LButtonDown(point)			 //左键压下
{
	point.x-=this.x_Distance;
	point.y-=this.y_Distance; 
	if (!PointInCurrentRect(this.m_ClientRect,point))
	{
		return;
	}   
	PointEqual(m_cpOriginalPoint_cursor,point);  

	this.b_LeftButtonDown=true;

	//功能: 判断当前点有在哪个区域的点区域中
	//清空上次左键选中区域集合
	var nLastSelectFigure=this.m_nCursorInFigureId;
	this.m_SelectSubFigureRectIdSet.ClearFigureRectData();
	m_nCursorInFigureId=0; 
	//判断当前点选中了哪些区域
	this.SelectSubFigureRectSet(this.m_cpOriginalPoint_cursor);  
	if (m_SelectSubFigureRectIdSet.m_nFigureRectCount>0 && this.b_LButtonDouC==false ) 
	{
		//list<CFigureRect>::iterator FindIterator;
		var FindIterator=new CFigureRect;
		var FindIndex=0;
		FindIterator=this.m_SelectSubFigureRectIdSet.m_FigureRect[FindIndex];
		var CFigureRect =new CFigureRect;
		SelectFigure = FindIterator;
		for (FindIndex;FindIndex<m_SelectSubFigureRectIdSet.m_nFigureRectCount;FindIndex++)
		{
			if(FindIterator.m_FigureRect.left > SelectFigure.m_FigureRect.left
				|| FindIterator.m_FigureRect.top > SelectFigure.m_FigureRect.top
				|| FindIterator.m_FigureRect.right < SelectFigure.m_FigureRect.right
				|| FindIterator.m_FigureRect.bottom < SelectFigure.m_FigureRect.bottom)
				SelectFigure = FindIterator;
				
			FindIterator=this.m_SelectSubFigureRectIdSet.m_FigureRect[FindIndex];
		}
		m_nCursorInFigureId=SelectFigure.m_nFigureID; 
	}   	
	if (this.m_nCursorInFigureId && this.b_ChangeFigureSize)
	{ 
		this.SearchPoint();
	} 
	if (this.b_DrawRect || this.b_DrawDoubleRect || this.b_DrawCircle || this.b_DrawPoly || this.b_LButtonDouC)
	{ 
		if (!this.PointGoOutSide(point))
		{
			//如果开始绘画方框
			if (this.b_DrawRect )
			{ 
				//如果开始绘画方框，点击了一个左键
				if (this.b_PreDrawRect)
				{
					this.b_PreDrawRect=false;
					//方框剩下的三个点
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=this.GetIntValue(point.x/m_fZoomNum);
					point.y=this.GetIntValue(point.y/m_fZoomNum);

					//list<CPoint >::iterator FindIterator;
					var FindIterator =new CPoint(0,0);
					var FindPointIndex=0;
					FindIterator=CurrentFigure.figure_data.m_CPoint[FindPointIndex];
					if(FindIterator.x > point.x)
					{
						var nTemp = FindIterator.x;
						FindIterator.x = point.x;
						point.x = nTemp;
					}
					if(FindIterator.y > point.y)
					{
						var nTemp = FindIterator.y;
						FindIterator.y = point.y;
						point.y = nTemp;
					}
					var p1=new CPoint(0,0);
					var p2=new CPoint(0,0);
					var p4=new CPoint(0,0);
					p1.x=FindIterator.x;
					p1.y=FindIterator.y;
					p2.x=point.x;
					p2.y=p1.y;
					p4.x=p1.x;
					p4.y=point.y;

					//其余三个点存入到图像
					this.CurrentFigure.figure_data.AddCPoint(p2);
					this.CurrentFigure.figure_data.AddCPoint(point);  
					this.CurrentFigure.figure_data.AddCPoint(p4);

					this.CurrentFigure.figure_rect.left=p1.x;
					this.CurrentFigure.figure_rect.top=p1.y;
					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y;

					this.m_nFigureCount++;
					this.CurrentFigure.figure_color=this.m_FigureColor;
					//CString figurename;
					//figurename.Format(_T("%d"),m_nFigureCount);
					this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName; 
					this.m_csCurrentDrawFigureName="";
					this.CurrentFigure.figure_id=this.m_nFigureCount; 
					this.CurrentFigure.figure_type=RectType;
					this.CurrentFigure.ReserverData=this.m_strDataReserved;

					this.m_FiguresSet.AddFigure(CurrentFigure);
				
					
					this.CurrentFigure.ClearFigureData(); 
					this.b_DrawRect=false; 
				}
				else
				{ 
					this.b_PreDrawRect=true;	 
					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					CurrentFigure.figure_data.AddCPoint(point);  //  存入到图像   
				}
			}
			else
				this.b_PreDrawRect=false; 

			//如果开始绘画双方框
			if (this.b_DrawDoubleRect )
			{ 
				//如果开始绘画双方框，点击了一个左键
				if (this.b_PreDrawDoubleRect)
				{
					this.b_PreDrawDoubleRect=false;
					//方框剩下的三个点
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum); 
					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y; 
					this.CurrentFigure.figure_rect_outside.right=point.x+GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.bottom=point.y+GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
					//不允许画不规范的双方框
					if ((this.CurrentFigure.figure_rect.right<=this.CurrentFigure.figure_rect.left) 
					|| (this.CurrentFigure.figure_rect.top>=this.CurrentFigure.figure_rect.bottom))
					{
						this.CurrentFigure.ClearFigureData();
					}
					else
					{
						this.m_nFigureCount++;
						this.CurrentFigure.figure_color=this.m_FigureColor;
						//CString figurename;
						//figurename.Format(_T("%d"),m_nFigureCount);
						this.CurrentFigure.figure_id=this.m_nFigureCount;
						this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;	
						this.m_csCurrentDrawFigureName="";
						this.CurrentFigure.figure_type=DrectType;
						this.CurrentFigure.ReserverData=this.m_strDataReserved;
						
						//存入
						m_FiguresSet.AddFigure(this.CurrentFigure);  
						
						//SetCurrentSelectFigure(CurrentFigure.figure_id);
						this.b_DrawDoubleRect=false;
						this.CurrentFigure.ClearFigureData();
					}

				}
				else
				{
					this.b_PreDrawDoubleRect=true;

					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入到图像
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y;
					this.CurrentFigure.figure_rect_outside.left=point.x-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.top=point.y-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
				}
			}
			else
			{
				this.b_PreDrawDoubleRect=false;
			} 

			//开始绘制圆
			if(this.b_DrawCircle)
			{ 
				if (this.b_PreDrawCircle)
				{
					this.b_PreDrawCircle=false;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);

					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y;
					this.m_nFigureCount++;
					this.CurrentFigure.figure_color=this.m_FigureColor; 
					//CString figurename;
					//figurename.Format(_T("%d"),m_nFigureCount);
					this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;
					this.m_csCurrentDrawFigureName="";
					this.CurrentFigure.figure_id=this.m_nFigureCount;
					this.CurrentFigure.figure_type=CircleType;
					
					this.CurrentFigure.ReserverData=this.m_strDataReserved;

					this.m_FiguresSet.AddFigure(CurrentFigure); 
					//FinishDraw(CurrentFigure.figure_id);
					//SetCurrentSelectFigure(CurrentFigure.figure_id);
					this.CurrentFigure.ClearFigureData();
					this.b_DrawCircle=false;
				}
				else
				{ 
					this.b_PreDrawCircle=true;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y; 
				}
			}
			else
				this.b_PreDrawCircle=false;

			if (this.b_LButtonDouC==true && this.b_DrawPoly)
			{	 
				this.m_TempLinesPointSet.AddCPoint(point);   //画实时线条 
				//将显示坐标转成真实坐标
				point.x-=this.OriginalPoint_Bitmap.x;
				point.y-=this.OriginalPoint_Bitmap.y;
				point.x=GetIntValue(point.x/this.m_fZoomNum);
				point.y=GetIntValue(point.y/this.m_fZoomNum);
				thisCurrentFigure.figure_data.AddCPoint((point));  //  存入到图像
			} 
		}  
	}
	this.RepaintControl();
}
	
	
// External User Event Operations
//外部消息响应 ，需要从外部传入给控件
function MouseWheel(zDelta, pt)  //滚动鼠标中建
{
	pt.x-=this.x_Distance;
	pt.y-=this.y_Distance;
	//理论上zDelta每次都是120或者-120 
	
	var zoomCount=(zDelta/120);  
	var x1=0,x2=0,y1=0,y2=0;
	var	InImageWidth=0,InImageHight=0;
	InImageWidth=(this.m_MovePoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum;
	InImageHight=(this.m_MovePoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum;
	if (zoomCount>0)
	{   //最大放大倍率		
		if (this.m_nScrollRate<FigureControl_MaxZoomScale)
		{
			return false; 
		}
		this.m_nScrollRate--;
		this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate);  
		var TestX=0,TestY=0;
		TestX=InImageWidth*(this.m_fZoomNum-Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1));
		TestY=InImageHight*(this.m_fZoomNum-Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1));
		this.OriginalPoint_Bitmap.x=GetIntValue(this.OriginalPoint_Bitmap.x-TestX); 
		this.OriginalPoint_Bitmap.y=GetIntValue(this.OriginalPoint_Bitmap.y-TestY);

	} 
	else
	{	 
		if (this.m_nScrollRate>-2*FigureControl_MaxZoomScale)
		{
			return false;
		}
		this.m_nScrollRate++;
		this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate); 
		var TestX=0,TestY=0;
		TestX=(InImageWidth*(this.m_fZoomNum- Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1)));
		TestY=(InImageHight*(this.m_fZoomNum- Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1)));
		this.OriginalPoint_Bitmap.x=GetIntValue(this.OriginalPoint_Bitmap.x-TestX); 
		this.OriginalPoint_Bitmap.y=GetIntValue(this.OriginalPoint_Bitmap.y-TestY);
	}     
	
	this.RepaintControl();  
}
	

function LButtonDown(point)			 //左键压下
{
	point.x-=this.x_Distance;
	point.y-=this.y_Distance; 
	if (!PointInCurrentRect(this.m_ClientRect,point))
	{
		return;
	}   
	PointEqual(this.m_cpOriginalPoint_cursor,point);  

	this.b_LeftButtonDown=true;

	//功能: 判断当前点有在哪个区域的点区域中
	//清空上次左键选中区域集合
	var nLastSelectFigure=this.m_nCursorInFigureId;
	this.m_SelectSubFigureRectIdSet.ClearFigureRectData();
	this.m_nCursorInFigureId=0; 
	//判断当前点选中了哪些区域
	this.SelectSubFigureRectSet(this.m_cpOriginalPoint_cursor);  
	var maxId=0;
	if (this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0 && this.b_LButtonDouC==false ) 
	{
		var FindIterator=new CFigureRect ;
		var FindIndex=0;		
		for (FindIndex;FindIndex<this.m_SelectSubFigureRectIdSet.m_nFigureRectCount;FindIndex++)
		{
			FindIterator=this.m_SelectSubFigureRectIdSet.m_FigureRect[FindIndex];
			if(FindIterator.m_nFigureID>maxId)  //将最后一个图形ID传出
			{
				maxId=FindIterator.m_nFigureID;
			}
		}
		this.m_nCursorInFigureId=maxId; 
	}   	
	if (this.m_nCursorInFigureId && this.b_ChangeFigureSize)
	{ 
		this.SearchPoint();
	} 
	if (this.b_DrawRect || this.b_DrawDoubleRect || this.b_DrawCircle || this.b_DrawPoly || this.b_LButtonDouC)
	{ 
		if (!this.PointGoOutSide(point))
		{
			//如果开始绘画方框
			if (this.b_DrawRect )
			{ 
				//如果开始绘画方框，点击了一个左键
				if (this.b_PreDrawRect)
				{
					this.b_PreDrawRect=false;
					//方框剩下的三个点
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);


					var FindIterator=new CPoint(0,0);
					var FindPointIndex=0;
					FindIterator=this.CurrentFigure.figure_data.m_CPoint[FindPointIndex];
					if(FindIterator.x > point.x)
					{
						var nTemp = FindIterator.x;
						FindIterator.x = point.x;
						point.x = nTemp;
					}
					if(FindIterator.y > point.y)
					{
						var nTemp = FindIterator.y;
						FindIterator.y = point.y;
						point.y = nTemp;
					}
					var p1=new CPoint(0,0);
					var p2=new CPoint(0,0);
					var p4=new CPoint(0,0);
					p1.x=FindIterator.x;
					p1.y=FindIterator.y;
					p2.x=point.x;
					p2.y=p1.y;
					p4.x=p1.x;
					p4.y=point.y;

					//其余三个点存入到图像
					this.CurrentFigure.figure_data.AddCPoint((p2));
					this.CurrentFigure.figure_data.AddCPoint((point));  
					this.CurrentFigure.figure_data.AddCPoint((p4));

					this.CurrentFigure.figure_rect.left=p1.x;
					this.CurrentFigure.figure_rect.top=p1.y;
					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y;

					this.m_nFigureCount++;
					this.CurrentFigure.figure_color=this.m_FigureColor;
					
					this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName; 
					this.m_csCurrentDrawFigureName="";
					this.CurrentFigure.figure_id=this.m_nFigureCount; 
					this.CurrentFigure.figure_type=RectType;
					this.CurrentFigure.ReserverData=this.m_strDataReserved;

					this.m_FiguresSet.AddFigure(this.CurrentFigure);
					//FinishDraw(CurrentFigure.figure_id);
					this.CurrentFigure.ClearFigureData(); 
					this.b_DrawRect=false; 
				}
				else
				{ 
					this.b_PreDrawRect=true;	 
					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					this.CurrentFigure.figure_data.AddCPoint((point));  //  存入到图像   
				}
			}
			else
				this.b_PreDrawRect=false; 

			//如果开始绘画双方框
			if (this.b_DrawDoubleRect )
			{ 
				//如果开始绘画双方框，点击了一个左键
				if (this.b_PreDrawDoubleRect)
				{
					this.b_PreDrawDoubleRect=false;
					//方框剩下的三个点
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum); 
					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y; 
					this.CurrentFigure.figure_rect_outside.right=point.x+GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.bottom=point.y+GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
					//不允许画不规范的双方框
					if ((this.CurrentFigure.figure_rect.right<=this.CurrentFigure.figure_rect.left) 
					|| (this.CurrentFigure.figure_rect.top>=this.CurrentFigure.figure_rect.bottom))
					{
						this.CurrentFigure.ClearFigureData();
					}
					else
					{
						this.m_nFigureCount++;
						this.CurrentFigure.figure_color=this.m_FigureColor;					
						this.CurrentFigure.figure_id=this.m_nFigureCount;
						this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;	
						this.m_csCurrentDrawFigureName="";
						this.CurrentFigure.figure_type=DrectType;						
						this.CurrentFigure.ReserverData=this.m_strDataReserved;

						//存入
						this.m_FiguresSet.AddFigure(this.CurrentFigure);  
						//FinishDraw(CurrentFigure.figure_id);
						
						this.b_DrawDoubleRect=false;
						this.CurrentFigure.ClearFigureData();
					}

				}
				else
				{
					this.b_PreDrawDoubleRect=true;

					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入到图像
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y;
					this.CurrentFigure.figure_rect_outside.left=point.x-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.top=point.y-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
				}
			}
			else
			{
				this.b_PreDrawDoubleRect=false;
			} 

			//开始绘制圆
			if(this.b_DrawCircle)
			{ 
				if (this.b_PreDrawCircle)
				{
					this.b_PreDrawCircle=false;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);

					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y;
					this.m_nFigureCount++;
					this.CurrentFigure.figure_color=this.m_FigureColor; 
					
					this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;
					this.m_csCurrentDrawFigureName="";
					this.CurrentFigure.figure_id=this.m_nFigureCount;
					this.CurrentFigure.figure_type=CircleType;
					this.CurrentFigure.ReserverData=this.m_strDataReserved;
					
					this.m_FiguresSet.AddFigure(this.CurrentFigure); 
					//FinishDraw(CurrentFigure.figure_id);
					
					this.CurrentFigure.ClearFigureData();
					this.b_DrawCircle=false;
				}
				else
				{ 
					this.b_PreDrawCircle=true;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y; 
				}
			}
			else
				this.b_PreDrawCircle=false;

			if (this.b_LButtonDouC==true && this.b_DrawPoly==true)
			{	 
				this.m_TempLinesPointSet.AddCPoint(point);   //画实时线条 
				//将显示坐标转成真实坐标
				point.x-=this.OriginalPoint_Bitmap.x;
				point.y-=this.OriginalPoint_Bitmap.y;
				point.x=GetIntValue(point.x/this.m_fZoomNum);
				point.y=GetIntValue(point.y/this.m_fZoomNum);
				this.CurrentFigure.figure_data.AddCPoint((point));  //  存入到图像
			} 
		}  
	}
	this.RepaintControl();
}

function LButtonUp( point)			//左键弹上
{
	this.b_LeftButtonDown=false;
	var b_moveWindow=false;
	
	//停止移动图形，将平移距离计算进原来坐标
	if (this.b_SubFiguresMove)
	{ 
		//list<Figure>::iterator FindIterator; 
		var FindIterator=new Figure;
		var FindIndex=0;
		FindIterator=this.m_FiguresSet.m_Figures[FindIndex];
		
		for(FindIndex;FindIndex<this.m_FiguresSet.m_nFigureCount;FindIndex++)
		{			
		
			FindIterator=this.m_FiguresSet.m_Figures[FindIndex];
		
			if ((FindIterator.figure_id==this.m_nCursorInFigureId )
				&& this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0 && this.b_FigurePointSelect==false)						
			{  
				FindIterator.MoveFigure(this.m_cpDistancePoint.x,this.m_cpDistancePoint.y); // (m_cpDistancePoint.x>2 ||m_cpDistancePoint.y>2))//防止轻微的移动  
				
				if (FindIterator.figure_type==DrectType)
				{
					FindIterator.DistanceToData(this.m_fZoomNum,DrectType);
				}
				else if (FindIterator.figure_type==CircleType)
				{
					FindIterator.DistanceToData(this.m_fZoomNum,CircleType);
				}
				else if (FindIterator.figure_type==RectType)
				{
					FindIterator.DistanceToData (this.m_fZoomNum,RectType);
				}
				else
				{
					FindIterator.DistanceToData(this.m_fZoomNum,PolyType);
				} 
			}				
		}
	}   
	//不在选择图形边缘点
	this.b_FigurePointSelect=false;  
	
}

	
function LButtonDblClk(point)			//左键双击
{
	point.x-=this.x_Distance;
	point.y-=this.y_Distance; 
	var tempPoint=new CPoint(0,0);
	tempPoint.x=GetIntValue((point.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
	tempPoint.y=GetIntValue((point.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
	if (!PointInCurrentRect(this.m_RectFigure,tempPoint))
	{
		return;
	}   
//删除多边形边缘点
	//list<Figure>::iterator Iterator;
	var Iterator=new Figure;
	var IfFind=false;
	var FindIndex=0;
	Iterator=this.m_FiguresSet.m_Figures[FindIndex];
	for(FindIndex;FindIndex<this.m_FiguresSet.m_nFigureCount;FindIndex++)
	{
		if (Iterator.figure_type==PolyType)
		{
			//std::list<CPoint>::iterator PointIterator;
			var PointIterator=new CPoint(0,0);
			var FindPointIndex=0;
			var PointNum=1;
			PointIterator=Iterator.figure_data.m_CPoint[FindPointIndex];
			for (FindPointIndex;FindPointIndex<Iterator.figure_data.nCPointCount;FindPointIndex++)
			{
				PointNum++;
				var pt=new CPoint(0,0);
				pt.x=GetIntValue(PointIterator.x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				pt.y=GetIntValue(PointIterator.y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				if (PointInPointRect(this.m_cpOriginalPoint_cursor,pt))
				{ 
					//删除一个边缘点
					if (PointNum%2==0)
					{
						Iterator.figure_data.eraseCPoint(FindPointIndex);	
					} 
					else//添加一个边缘点
					{
						var BeginPoint=new CPoint(0,0);
						var EndPoint=new CPoint(0,0);
						var MidPoint=new CPoint(0,0);
						BeginPoint=PointIterator;
						var NextPoint=FindPointIndex+1;
						PointIterator=Iterator.figure_data.m_CPointp[NextPoint];
						
						if (PointIterator==Iterator.figure_data.end())
						{
							break;
						}
						
						EndPoint=PointIterator;
						MidPoint.x=GetIntValue(((BeginPoint.x+EndPoint.x)/2.0));
						MidPoint.y=GetIntValue(((BeginPoint.y+EndPoint.y)/2.0)); 
						Iterator.figure_data.InsertPoint(FindPointIndex,MidPoint);
						
					} 
					IfFind=true;
					this.RepaintControl();
					break;
				}
			}
		}
		if (IfFind==true)
		{
			break;
		} 
	}

//对多边形的处理	 
	if (this.b_LButtonDouC==false && this.b_DrawPoly)  //第一次双击，开始画图形
	{
		//给控件图形赋值，初始化
		this.b_LButtonDouC=true; 
		this.m_TempLinesPointSet.AddCPoint(point);   //实时画时显示
		//将显示坐标转成真实坐标
		point.x-=this.OriginalPoint_Bitmap.x;
		point.y-=this.OriginalPoint_Bitmap.y;
		point.x=GetIntValue(point.x/this.m_fZoomNum);
		point.y=GetIntValue(point.y/this.m_fZoomNum);
		this.CurrentFigure.figure_data.AddCPoint((point));  //存入到列表中  
	}
	else if(this.b_LButtonDouC==true && this.b_DrawPoly)   //又一次双击，结束画上次图形
	{
		this.b_LButtonDouC=false; 
		//std::list<CPoint>::iterator PointIterator;
		var PointIterator=new CPoint(0,0);
		var BeginPoint=new CPoint(0,0);
		var EndPoint=new CPoint(0,0);
		var MidPoint=new CPoint(0,0);
		var FindPointIndex=0;
		PointIterator=this.CurrentFigure.figure_data.m_CPoint[FindPointIndex];
		
		for (FindPointIndex;FindPointIndex<this.CurrentFigure.figure_data.nCPointCount;FindPointIndex++)
		{
			PointIterator=this.CurrentFigure.figure_data.m_CPoint[FindPointIndex];
			
			/*BeginPoint=PointIterator;
			var NextPoint=FindPointIndex+1;
			PointIterator=this.CurrentFigure.figure_data.m_CPoint[NextPoint];
			if (PointIterator==this.CurrentFigure.figure_data.m_CPoint[this.CurrentFigure.figure_data.nCPointCoun-1])
			{
				break;
			}
			EndPoint=PointIterator;
			MidPoint.x=GetIntValue(((BeginPoint.x+EndPoint.x)/2.0));
			MidPoint.y=GetIntValue(((BeginPoint.y+EndPoint.y)/2.0));
			this.CurrentFigure.figure_data.InsertPoint(FindPointIndex,MidPoint);*/
			
		}

		this.m_nFigureCount++;
		this.CurrentFigure.figure_id=this.m_nFigureCount;
		this.CurrentFigure.figure_color=this.m_FigureColor;
		this.CurrentFigure.figure_type=PolyType;  
		this.m_csCurrentDrawFigureName=this.m_nFigureCount;
		
		this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;
		this.CurrentFigure.ReserverData=this.m_strDataReserved;

		this.m_csCurrentDrawFigureName="";
		this.m_FiguresSet.AddFigure(this.CurrentFigure);
		//FinishDraw(CurrentFigure.figure_id);
		//SetCurrentSelectFigure(CurrentFigure.figure_id);
		this.CurrentFigure.ClearFigureData(); 
		this.m_TempLinesPointSet.ClearData();
		this.b_DrawPoly=false;
		this.RepaintControl();
		
		
	}  
}



//External Operation Functions

//功能: 显示菜单信息
function ShowInfo(csInfo,poin)	
{}	
//回到初始位置 
function BackToInitFigure()	
{}
//清除当前绘制状态
function ClearDrawStatus()	
{}
//删除所有图形
function ClearAllFigures()					
{}
//取消填充图形
function CancelFillFigure(nId)
{}
//复制指定图形
function CopyCurrentSelectFigureRect(nId)			
{}
//删除指定类型的图形
function DeleteFigureType(nFigureType)		
{}
//删除最后一个图形
function DeleteLastFigure()			
{}
//删除指定图形
function DeleteSelectFigure(int)						
{}
//删除指定的图形区域，不包括双方框
function DeleteFigureByName(csName)	
{}
//是否选中边缘点
function BSelectFigurePoint()		
{}
//双方框对角位置是否同时拖动
function SetDRectChooseType(bAllShift)
{}
//图形形是否能够移动
function SetFigureMoveStatus(bStatus)		
{
	this.b_SubFiguresMove=bStatus;
}
//显示边小方框
function ShowPointRect(bShow)			
{}
//是否允许改变图形大小
function ChangeFigureSize(bChange)			
{}
/************************************************************************/
/* 
该组函数用来在控件中手动绘制图形
csFigureName	图形名字
strReservedData 保留字段
*/
/************************************************************************/
function DrawRectFigure(csFigureName,strReservedDat)//绘制方框
{
	this.m_strDataReserved=strReservedDat;

	this.m_csCurrentDrawFigureName=csFigureName;
	this.b_DrawRect=true;
	this.b_DrawDoubleRect=false;
	this.b_DrawPoly=false;
	this.b_DrawCircle=false; 

	this.b_PreDrawRect=false;
	this.b_PreDrawDoubleRect=false;
	this.b_PreDrawCircle=false;
	this.b_LButtonDouC=false;
	this.CurrentFigure.ClearFigureData();
	this.m_TempLinesPointSet.ClearData();
	return this.b_DrawRect;
}

function DrawDoubleRectFigure(csFigureName,strReservedData)		//绘制双方框
{
	this.m_strDataReserved=strReservedData;

	this.m_csCurrentDrawFigureName=csFigureName;
	this.b_DrawRect=false;
	this.b_DrawDoubleRect=true;
	this.b_DrawPoly=false;
	this.b_DrawCircle=false; 

	this.b_PreDrawRect=false;
	this.b_PreDrawDoubleRect=false;
	this.b_PreDrawCircle=false;
	this.b_LButtonDouC=false;
	this.CurrentFigure.ClearFigureData();
	this.m_TempLinesPointSet.ClearData();
	return this.b_DrawDoubleRect;
}
function DrawPolyFigure(csFigureName,strReservedData)				//绘制多边形
{
	this.m_strDataReserved=strReservedData;
	this.b_DrawRect=false;
	this.b_DrawDoubleRect=false;
	this.b_DrawPoly=true;
	this.b_DrawCircle=false; 

	this.b_PreDrawRect=false;
	this.b_PreDrawDoubleRect=false;
	this.b_PreDrawCircle=false;
	this.b_LButtonDouC=false;
	this.CurrentFigure.ClearFigureData();
	this.m_TempLinesPointSet.ClearData();
	return this.b_DrawPoly;
}
function DrawCircleFigure(csFigureName,strReservedData)			//绘制圆形 
{
	this.m_strDataReserved=strReservedData;
	this.b_DrawRect=false;
	this.b_DrawDoubleRect=false;
	this.b_DrawPoly=false;
	this.b_DrawCircle=true; 

	this.b_PreDrawRect=false;
	this.b_PreDrawDoubleRect=false;
	this.b_PreDrawCircle=false;
	this.b_LButtonDouC=false;
	this.CurrentFigure.ClearFigureData();
	this.m_TempLinesPointSet.ClearData();
	return this.b_DrawCircle;
}				

/************************************************************************/
/*                              
获取图形数据内容
需要获取所有图形数据内容时，可以调用while(GetNextFigures(Figure figureData)){}的形式
*/
/************************************************************************/
//获取指定图形信息，返回一个指针可以修改Figure信息
function GetFigure(figureData,nFigureId)
{}
//兼容原来的代码，获取一个Figure的拷贝
function GetFigure1(figureData,nFigureId)
{}
//获取指定所有图形信息		
function GetNextFigures(figureData)
{}
//获取控件内数据 CFigureControl *DesFigureControl
function GetFigureData(DesFigureControl)
{}
function GetFigureCount()
{}
//获得给定图形类型
function GetFigureType(id,type)	
{}
//获取指定图形点个数
function GetFigurePointNum(nFigureId)
{}
//获取图形的点集合,点的坐标为相对于图像左上点而言的位置 		
//BOOL   CPoint PointData[],int nPointNum)
function GetFigurePoints(PointData,nPointNum)				
{}
//获得当前图像与(0,0)的偏移 如果返回为true获取成功，如果为false，超出图像范围
//CPoint 
function GetShiftDistance()					
{}
//获得当前鼠标在图像中的位置
//BOOL  PointData[MaxCPointCount]
function GetCurrentCusorInImage(PointData)					
{}
//获得当前选中的图形ID集合
//const int*   int idNum
function GetCurrentSelectFigureIdSet(idNum)	
{}
//获得当前的放大倍数
//float 
function GetZoomRate()					
{}
//设置当前缩放系数
//float 
function SetZoomRate(fRate)			
{}
//返回鼠标选中图形id
//int 
function GetCurrentSelectFigureId()			
{}
//返回鼠标选中图形id，id为设置选中的图形id
//int  int id
function GetCurrentSelectFigureId(id)		
{}
//获得最后一个图形形ID
//int 
function GetLastFigureId()				
{}
//bool 
function GetFigureDrawStatus()
{}
//设置当前绘图颜色
function SetDrawFigureColor(COLORREF )				
{}
//修改图形ID
//BOOL 
function SetFigureId(nOldFigureId,nNewFigureId)
{}
//控件与窗口的偏移 
//BOOL 		
function setControlShiftDistance(nX,nY)			
{}
//设置指定图形移动距离
//BOOL 
function setFigureShiftDistance(nId,nX ,nY)
{}
//设置透明率 0-100 
function setTransparentFigureRate(nRate,nFigureId)					
{}
//设置指定图形颜色
function SetFigureColor(COLORREF,nFigureId)			
{}
//设置当前图形风格 1-16, bSetSingle表示是否只设置当前Figure
function SetFigureStyle(nStyleType,nFigureId,bSetSingle)	
{}
//设置图形状态(ALLOWMOVE,ALLOWSIZE), bMode=TRUE 表示添加，bMode=FALSE表示删除
function SetFigureStates(nStates,nFigureId, bMode)
{}
//设置图形的名称
function SetFigureName(csName,FigureId)
{}
//设置指定图形的保留字段内容  void *ReservedData,int FigureId
function SetFigureReservedData(ReservedData,FigureId)
{}
//指定当前选中的图形
function SetCurrentSelectFigure(nId)				
{}
//显示蒙版效果 
//BOOL 
function ShowMaskingProcess(COLORREF,bMask)
{}
//设置初始背景颜色
//bshowAlways 是否背景颜色一直显示
function SetBackGroundColor(COLORREF ,bshowAlways)		
{}
//图像平移距离
function SetFigureShiftDistance(nX ,nY)
{}
//移动所有图形
function SetMoveAllFigures(bMove)
{
	this.b_MoveAllFigures=bMove;
}
//设置图像根据当前控件大小缩放
function SetFitFillControl()
{
	var nImageWidth=this.m_Image.width;
	var nImageHeight=this.m_Image.height;
	var nWidth=this.m_ClientRect.width;
	var nHeight=this.m_ClientRect.height;
	var TempNum,fZoomNum=1;	
	TempNum=(nHeight*1.0/nImageHeight);
	fZoomNum=TempNum;

	TempNum=(nWidth*1.0/nImageWidth);
	if (fZoomNum>TempNum)
	{
		fZoomNum=TempNum;
	}
	var fMinValue=1.0;
	for (var i=FigureControl_MaxZoomScale;i<FigureControl_MaxZoomScale*-1;i++)
	{
		if (Math.abs(Math.pow(FigureControl_ScaleBot,i)-fZoomNum)<fMinValue)
		{
			fMinValue=Math.abs(Math.pow(FigureControl_ScaleBot,i)-fZoomNum);
			this.m_nScrollRate=i;
		}
	}
	this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate);
	this.RepaintControl();
}
//填充当前图形  
//int 
function FillFigure(nFigureId,COLORREF)
{}
//设置是否显示外围图形框
function SetShowFigureOutsideLine(bSHow,COLORREF)
{}
//添加禁止拖动图像id
//BOOL 
function AddForbiddenFigureId(nFigureId)
{}

//删除禁止拖动图像id
//BOOL 
function DeleteForbiddenFigureId(nFigureId)		
{}
//设置当前矩形为正方形
//BOOL 
function SetRectToSquare(FigureId)
{}
//旋转图形
//BOOL 
function RotateFigure(nAngle,CenterPoint,nFigureId)
{}
//缩放图形
//BOOL 
function ZoomFigure(fZoomRate,CenterPoint,nFigureId)
{}
//设置为插值模式
function SetStretchModel(bInterpose)
{}
/************************************************************************/
/* 
设置标记点
show  是否显示
LabelPoint 屏幕坐标
bOutSide  是否是外部坐标                                                                    
*/
/************************************************************************/
function  ShowPositionLabel(BOOL,point,BOOL)		
{}
//获取鼠标所在位置
//void GetCursorPosition(CPoint);								

/************************************************************************/
/* 
PointData	点数据
nPointNum	点个数
COLORREF 图形颜色
CString 图形名字
strReservedDat 保留数据
返回值:		新建图形ID
*/
/************************************************************************/
//外部传入多边形方框
//int   CPoint *PointData,int nPointNum,COLORREF,CString,void* strReservedData=NULL
function O_DrawPolyFigure(PointData,nPointNum,COLORREF,strName,strReservedData)
{}
//int 
function O_DrawPolyFigure1(PointData,nPointNum,COLORREF,strName,strReservedData)
{}
//外部传入方框 CPoint *PointData
function O_DrawRectFigure(PointData,COLORREF,strName,strReservedData)		
{}
function O_DrawRectFigure1(OutSideRect,COLORREF,strName,strReservedData)
{}
//外部传入圆 
//int  CPoint *PointData
function O_DrawCircleFigure(PointData,COLORREF,strName, strReservedDat)	
{}
//int 
function O_DrawCirlceFigure1(CenterPoint,nRadius,FigureName,FiugreColor,strReservedDat)
{}
//外部传双方框  
//int 
function O_DrawDoubleRectFigure(InSidePointData,OutSidePointData,COLORREF,strName,strReservedDat)	
{}
//外部传双方框
//int 
function O_DrawDoubleRectFigure1(InsideRect,OutsideRect,FigureColor,FigureName,strReservedDat)
{}		

/************************************************************************/
/* 用于修改控件内部图像数据内容  
注：修改后数据无法还原
所有通道的图像在控件内部都转换为RGBA处理，当需要修改单通道时，可以将RGB值都设为一样
*/
/************************************************************************/
//修改图像单像素
//BOOL 
function SetImagePix(pt,nRValue,nGValue,nBValue)				
{}
//获取图像单像素内容
//BOOL  CPoint pt,int RValue,int nGValue,int nBValue
function GetImagePix(pt,RValue,nGValue,nBValue) 
{}
//刷新控件
function ReFreshControl()
{}						
//释放控件数据
//BOOL 
function FreeControl()
{}
//public: 
/************************************************************************/
/* 
Imgobject IMG_OBJ *buffer
Pt 控件在所在应用程序窗口的位置的左上角
ImgColor 初始颜色
ZoomData 初始放大倍数
FilePath 图片路径
pParent  控件所在窗口指针
返回值：是否初始化成功
*/
/************************************************************************/
//从buffer导入

//BOOL IMG_OBJ *Imgobject,CWnd *pParent,COLORREF ImgColor=RGB(255,0,0),float ZoomData=0, bEnableEvent
function InitFigureControlFromBuffer(Imgobject,pParent,ImgColor,ZoomData,bEnableEvent)  
{
}
//从文件导入数据
//BOOL  LPCTSTR FilePath,CPoint pt,COLORREF ImgColor=RGB(255,0,0),float ZoomData=0, BOOL bEnableEvent=FALSE
function InitFigureControlFromFile(context,canvas,ImageName,Control)
{
	this.m_Context=context;
	this.m_Canvas=canvas;	
	var Rect=getBrowserPosition(this.m_Canvas);	
	this.x_Distance=Rect.left;
	this.y_Distance=Rect.top;
	
	this.b_LoadData=true;

	this.m_Image.onload=function(){		
	 Control.SetFitFillControl();
	 Control.ShiftImageToCenter();
    }   
	
	this.m_Image.src=ImageName; 	
	this.m_ClientRect=this.m_Canvas.getBoundingClientRect()
	
	
	//鼠标缩放
	this.m_Canvas.onmousewheel=this.m_Canvas.onwheel=function(event){
		var pt=new CPoint(event.clientX,event.clientY);
		Control.MouseWheel(event.wheelDelta,pt);
		Control.RepaintControl();
	}	
	
	//鼠标按下左键
	this.m_Canvas.onmousedown=function(event){	
		
		if(event.button==0)
		{
			var pt=new CPoint(event.clientX,event.clientY);
			Control.m_bMouseClickFlag=true;
			Control.LButtonDown(pt);
			
			//鼠标移动
			Control.m_Canvas.onmousemove=function(event)
			{
			  Control.m_Canvas.style.cursor="move";
			  var pt=new CPoint(event.clientX,event.clientY);		  
			  Control.MouseMove(pt);
			}
		}
		
	    //鼠标松开左键	
		Control.m_Canvas.onmouseup=function(){
			if(event.button==0)
			{
				Control.m_bMouseClickFlag=false;
				var pt=new CPoint(event.clientX,event.clientY);
			
				Control.LButtonUp(pt);
				Control.m_Canvas.onmousemove=null;
				Control.m_Canvas.onmouseup=null;
				Control.m_Canvas.style.cursor="default";
			}		
		}			
	}
	
	//鼠标移动
	this.m_Canvas.onmousemove=function(event)
	{
	  var pt=new CPoint(event.clientX,event.clientY);	  
	  Control.MouseMove(pt);
	}
	

	//鼠标双击左键	
	this.m_Canvas.ondblclick=function()
	{
		if(event.button==0)
		{
			var pt=new CPoint(event.clientX,event.clientY);		
			Control.LButtonDblClk(pt);
		}		
	}
}
	


//未初始化，用当前环境显示
//BOOL  IMG_OBJ*
function LoadImageFromBuffer(fControl)
{
	//var imagedata_Org = this.m_Context.getImageData(0, 0,this.m_Image.width, this.m_Image.height);
	var imagedata;//=mew Image;
	//Image.
	 for(var i = 0, n = imagedata.data.length; i < n; i += 3) 
	 {           
		 imagedata.data[i + 0] = 255 - imagedata.data[i + 0]; //red;
		 imagedata.data[i + 1] = 255 - imagedata.data[i + 1]; //green
		 imagedata.data[i + 2] = 255 - imagedata.data[i + 2]; //blue
         //imagedata.data[i + 3] = 255 - imagedata.data[i + 3]; //a
      }
     this.m_Context.putImageData(imagedata, 0, 0);
}			
//未初始化，用当前环境显示
//BOOL  LPCTSTR FilePath
function LoadImageFromFile(ImageName,Control)
{		
	this.m_Image.onload=function(){
	 Control.RepaintControl();
    }   
	
	this.m_Image.src=ImageName; 		
	
	//鼠标缩放
	this.m_Canvas.onmousewheel=this.m_Canvas.onwheel=function(event){
		var pt=new CPoint(event.clientX,event.clientY);
		Control.MouseWheel(event.wheelDelta,pt);
		Control.RepaintControl();
	}	
	
	//鼠标按下左键
	this.m_Canvas.onmousedown=function(event){	
		
		if(event.button==0)
		{
			var pt=new CPoint(event.clientX,event.clientY);
			Control.m_bMouseClickFlag=true;
			Control.LButtonDown(pt);
			
			//鼠标移动
			Control.m_Canvas.onmousemove=function(event)
			{
			  Control.m_Canvas.style.cursor="move";
			  var pt=new CPoint(event.clientX,event.clientY);		  
			  Control.MouseMove(pt);
			}
		}
		
	    //鼠标松开左键	
		Control.m_Canvas.onmouseup=function(){
			if(event.button==0)
			{
				Control.m_bMouseClickFlag=false;
				var pt=new CPoint(event.clientX,event.clientY);
			
				Control.LButtonUp(pt);
				Control.m_Canvas.onmousemove=null;
				Control.m_Canvas.onmouseup=null;
				Control.m_Canvas.style.cursor="default";
			}		
		}			
	}
	
	//鼠标移动
	this.m_Canvas.onmousemove=function(event)
	{
	  var pt=new CPoint(event.clientX,event.clientY);	  
	  Control.MouseMove(pt);
	}
	

	//鼠标双击左键	
	this.m_Canvas.ondblclick=function()
	{
		if(event.button==0)
		{
			var pt=new CPoint(event.clientX,event.clientY);		
			Control.LButtonDblClk(pt);
		}		
	}
}						

//回调函数，用来处理外部绘制要求
//BOOL 

//nType=1,3,4
//BOOL 
function WriteBmpToFile(nType,csPath)			
{} 
//BOOL list<Figure>::iterator pFigure, int nShiftX, int nShiftY
function CheckFigureGotoOutSide(pFigure, nShiftX,nShiftY)
{}

//CRect * pRect , list<Figure>::iterator Iterator
function GetFigureOutsideRect(pRect,Iterator)
{}

function MouseMove(point)			 //移动鼠标
{
	var bInvalidate=0;
	point.x-=this.x_Distance;
	point.y-=this.y_Distance;  
	var nSelectRectSize=GetIntValue(2+Math.abs(1/this.m_fZoomNum));
	if (!PointInCurrentRect(this.m_ClientRect,point))
	{
		this.b_CursorInOutSide=true;
		return;
	} 
	else
	{
		this.b_CursorInOutSide=false;
	}

	if (this.b_DrawRect || this.b_DrawPoly ||this.b_DrawCircle ||this.b_LeftButtonDown ||this.b_DrawDoubleRect)
	{
		bInvalidate++;
	}

	PointEqual(this.m_MovePoint_cursor,point);  

	//如果画图形时，鼠标移动到对象图外
	if ((this.b_DrawRect || this.b_DrawPoly ||this.b_DrawCircle) && this.PointGoOutSide(this.m_MovePoint_cursor))
	{
		return;
	} 

	var tempPoint=new CPoint(0,0);
	tempPoint.x=this.m_MovePoint_cursor.x+FigureControl_DoubleRectDistance;
	tempPoint.y=this.m_MovePoint_cursor.y+FigureControl_DoubleRectDistance;
	if (this.PointGoOutSide(tempPoint) && this.b_DrawDoubleRect)
	{
		return;
	}

	if(this.m_bMouseClickFlag)
	{
		this.m_cpCurrentPoint_cursor.x=point.x;
		this.m_cpCurrentPoint_cursor.y=point.y;  	
		
		this.m_cpDistancePoint.x=this.m_cpCurrentPoint_cursor.x-this.m_cpOriginalPoint_cursor.x;
		this.m_cpDistancePoint.y=this.m_cpCurrentPoint_cursor.y-this.m_cpOriginalPoint_cursor.y;   

		var m_cpCurrentPoint_cursor=new CPoint(0,0);
		PointEqual(m_cpCurrentPoint_cursor,point);  
		

		//拉动图形边缘点		 
		if (this.b_FigurePointSelect&&  !this.PointGoOutSide(this.m_cpCurrentPoint_cursor))
		{
			var Index=0;
			var Iterator=new Figure; 
			for(Index;Index<this.m_FiguresSet.m_nFigureCount;Index++)
			{
				Iterator=this.m_FiguresSet.m_Figures[Index];
				var b_find=0;
				var b_RelativeWindow=false;
				var distance=0;
				varcurrentFigurePos=-1;
				
				if (Iterator.figure_id==this.CurrentSelectPoint.Figure_id)
				{				
					if ( Iterator.figure_type==RectType || Iterator.figure_type==PolyType)
					{  
						var FindIterator=new CPoint(0,0);
						var FindIndex=0;
						var pointNum=0 //当前移动到第几个点
						var nSquredMoveDistance=0;
						for(FindIndex;FindIndex<Iterator.figure_data.nCPointCount;FindIndex++)
						{
							pointNum++; 
							FindIterator=Iterator.figure_data.m_CPoint[FindIndex];
							
							if ((FindIterator.x==this.CurrentSelectPoint.Figure_point.x  && FindIterator.y==this.CurrentSelectPoint.Figure_point.y))
							{
								if (Iterator.figure_type==PolyType)
								{		
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									
									this.CurrentSelectPoint.Figure_point.x=FindIterator.x;
									this.CurrentSelectPoint.Figure_point.y=FindIterator.y; 
								}
								if ( Iterator.figure_type==RectType)
								{									
									var nMoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-FindIterator.x; 
									var nMoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-FindIterator.y; 
									nSquredMoveDistance=nMoveDistance_x;
									
									switch (pointNum)
									{
									case 1:  //第一个点
										if (Iterator.bShowSqure)
										{											
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;

											FindIterator=Iterator.figure_data.m_CPoint[3];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;											
										}
										else
										{
											var pt=new CPoint(0,0);			
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);										
											
											Iterator.figure_data.m_CPoint[0].x=pt.x;
											Iterator.figure_data.m_CPoint[0].y=pt.y;
											
											Iterator.figure_data.m_CPoint[1].y=pt.y;
											
											Iterator.figure_data.m_CPoint[3].x=pt.x;			
										}				
										break;						
									case 2:
										if (Iterator.bShowSqure)
										{
											FindIterator=Iterator.figure_data.m_CPoint[0];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[3];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;										
										}
										else
										{
											var pt=new CPoint(0,0);				
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);											
											
											Iterator.figure_data.m_CPoint[1].x=pt.x;
											Iterator.figure_data.m_CPoint[1].y=pt.y;
											
											Iterator.figure_data.m_CPoint[0].y=pt.y;
											
											Iterator.figure_data.m_CPoint[2].x=pt.x;												
										}										
										break;
									case 3:
										if (Iterator.bShowSqure)
										{
											FindIterator=Iterator.figure_data.m_CPoint[0];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;											
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[3];
										}
										else
										{
											var pt=new CPoint(0,0);				
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);											
											
											Iterator.figure_data.m_CPoint[2].x=pt.x;
											Iterator.figure_data.m_CPoint[2].y=pt.y;
											
											Iterator.figure_data.m_CPoint[1].x=pt.x;
											
											Iterator.figure_data.m_CPoint[3].y=pt.y;											
										}										
										break;
									case 4:
										if (Iterator.bShowSqure)
										{
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[0];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
										}
										else
										{
											var pt=new CPoint(0,0);			
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);										
											
											Iterator.figure_data.m_CPoint[3].x=pt.x;
											Iterator.figure_data.m_CPoint[3].y=pt.y;
											
											Iterator.figure_data.m_CPoint[2].y=pt.y;
											
											Iterator.figure_data.m_CPoint[0].x=pt.x;										
										}										
										break;
									default:
										break;
									}			
										this.CurrentSelectPoint.Figure_point.x=FindIterator.x;
										this.CurrentSelectPoint.Figure_point.y=FindIterator.y; 						
									b_find=1;
									break; //找到该点后退出
								}
							} //end of list of point//*/
							if ((Iterator.figure_type==RectType  &&this.CurrentSelectPoint.nPointIndex>=5))
							{
								//中间点								
								FindIterator=Iterator.figure_data.m_CPoint[0];
								var pt=new CPoint(0,0);	
								switch(this.CurrentSelectPoint.nPointIndex)
								{
								case 5:		
									pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[1];
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									break;
								case 6:			
									pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);									
									FindIterator=Iterator.figure_data.m_CPoint[1];
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[2];
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);	
									break;
								case 7:		
									pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);								
									FindIterator=Iterator.figure_data.m_CPoint[2];
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[3];
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);	
									break;
								case 8:		
									pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[3];
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);	
									break;
								default:
									break;
								}								
								b_find=1;
								//break; //找到该点后退出
							}
						} 	 //end of recttype ,polytype
					}
					if(Iterator.figure_type==CircleType)
					{ 
						var pt=new Array(5);
						for(var index=0;index<5;index++)
						pt[index]=new CPoint(0,0);
						
						pt[1].x=Iterator.figure_rect.left+GetIntValue((Iterator.figure_rect.right-Iterator.figure_rect.left)/2);
						pt[1].y=Iterator.figure_rect.top; 
						pt[2].x=Iterator.figure_rect.right;
						pt[2].y=Iterator.figure_rect.top+GetIntValue((Iterator.figure_rect.bottom-Iterator.figure_rect.top)/2); 
						pt[3].x=Iterator.figure_rect.left+GetIntValue((Iterator.figure_rect.right-Iterator.figure_rect.left)/2);
						pt[3].y=Iterator.figure_rect.bottom; 
						pt[4].x=Iterator.figure_rect.left;
						pt[4].y=Iterator.figure_rect.top+GetIntValue((Iterator.figure_rect.bottom-Iterator.figure_rect.top)/2);

						for (var i=1;i<=4;i++)
						{	  
							if(Math.abs(pt[i].x-this.CurrentSelectPoint.Figure_point.x)<=nSelectRectSize 
							&& Math.abs(pt[i].y-this.CurrentSelectPoint.Figure_point.y)<=nSelectRectSize)
							{

								switch(i)
								{
								case 1:
									Iterator.figure_rect.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); //存入图像点
									this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.top;									
									break;
								case 2:									
									Iterator.figure_rect.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.right;
									break;
								case 3:
									Iterator.figure_rect.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.bottom;									
									break;
								case 4:
									Iterator.figure_rect.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.left;
									break;
								default:
									break;									
								} 
								b_find=1;
								break;
							}
						}
					}
					if (Iterator.figure_type==DrectType)
					{
						var pt=new Array(9);
						for(var index=0;index<9;index++)
						pt[index]=new CPoint(0,0);
						
						pt[1].x=Iterator.figure_rect.left;
						pt[1].y=Iterator.figure_rect.top;
						pt[2].x=Iterator.figure_rect.right;
						pt[2].y=Iterator.figure_rect.top;
						pt[3].x=Iterator.figure_rect.right;
						pt[3].y=Iterator.figure_rect.bottom;
						pt[4].x=Iterator.figure_rect.left;
						pt[4].y=Iterator.figure_rect.bottom;
						pt[5].x=Iterator.figure_rect_outside.left;
						pt[5].y=Iterator.figure_rect_outside.top;
						pt[6].x=Iterator.figure_rect_outside.right;
						pt[6].y=Iterator.figure_rect_outside.top;
						pt[7].x=Iterator.figure_rect_outside.right;
						pt[7].y=Iterator.figure_rect_outside.bottom;
						pt[8].x=Iterator.figure_rect_outside.left;
						pt[8].y=Iterator.figure_rect_outside.bottom;  
						for (var i=1;i<=8;i++)
						{	 
							if(Math.abs(pt[i].x-this.CurrentSelectPoint.Figure_point.x)<nSelectRectSize && Math.abs(pt[i].y-this.CurrentSelectPoint.Figure_point.y)<nSelectRectSize)
							{
								var MoveDistance_x=0,MoveDistance_y=0; 
								var CurrentPointCursor=new CPoint(0,0);
								CurrentPointCursor.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
								CurrentPointCursor.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
								switch(i)
								{
								case 1: 
									if (CurrentPointCursor.x>=pt[2].x || CurrentPointCursor.y>=pt[4].y )
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.left; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.top; 
										Iterator.figure_rect.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.left+MoveDistance_x<=0 || Iterator.figure_rect_outside.top+MoveDistance_y<=0)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.left+=MoveDistance_x;
											Iterator.figure_rect_outside.top+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.top;
											break;
										}  
									} 
								case 2:
									if (CurrentPointCursor.x<=pt[1].x || CurrentPointCursor.y>=pt[3].y)
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.right; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.top; 
										Iterator.figure_rect.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.right+MoveDistance_x>=this.m_RectFigure.right || Iterator.figure_rect_outside.top+MoveDistance_y<=0)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.right+=MoveDistance_x;
											Iterator.figure_rect_outside.top+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.top;
											break;
										} 

									} 
								case 3:
									if (CurrentPointCursor.x<=pt[4].x || CurrentPointCursor.y<=pt[2].y)
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.right; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.bottom; 
										Iterator.figure_rect.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.right+MoveDistance_x>=this.m_RectFigure.right || Iterator.figure_rect_outside.bottom+MoveDistance_y>=this.m_RectFigure.bottom)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.right+=MoveDistance_x;
											Iterator.figure_rect_outside.bottom+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.bottom;
											break;
										} 
									}									
								case 4:
									if (CurrentPointCursor.x>=pt[3].x || CurrentPointCursor.y<=pt[1].y)
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.left; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.bottom; 
										Iterator.figure_rect.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.left+MoveDistance_x<=0 || Iterator.figure_rect_outside.bottom+MoveDistance_y>=this.m_RectFigure.bottom)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.left+=MoveDistance_x;
											Iterator.figure_rect_outside.bottom+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.bottom;
											break;
										} 
									}									
								case 5: 									
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,LeftTop))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect_outside.left; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect_outside.top; 

											if (Iterator.figure_rect_outside.right-MoveDistance_x>=this.m_RectFigure.right || Iterator.figure_rect_outside.bottom-MoveDistance_y>=this.m_RectFigure.bottom)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
												//根据纪念币算法修改
												Iterator.figure_rect_outside.right-=MoveDistance_x;
												Iterator.figure_rect_outside.bottom-=MoveDistance_y;
												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
											}		
										}
										else
										{
											Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
										}

									} 
									break;
								case 6:								
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,RightTop))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect_outside.right; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect_outside.top; 

											if (Iterator.figure_rect_outside.left-MoveDistance_x<=0 || Iterator.figure_rect_outside.bottom-MoveDistance_y>=this.m_RectFigure.bottom)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
												//根据纪念币算法修改
												Iterator.figure_rect_outside.left-=MoveDistance_x;
												Iterator.figure_rect_outside.bottom-=MoveDistance_y; 

												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
											}		
										}
										else
										{
											Iterator.figure_rect_outside.right=GetIntValue((m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.top=GetIntValue((m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
										}

									} 
									break;
								case 7:								
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,RightBottom))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect_outside.right; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect_outside.bottom; 

											if (Iterator.figure_rect_outside.left-MoveDistance_x<=0 || Iterator.figure_rect_outside.top-MoveDistance_y<=0)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 

												//根据纪念币算法修改
												Iterator.figure_rect_outside.left-=MoveDistance_x;
												Iterator.figure_rect_outside.top-=MoveDistance_y;

												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
											}
										}
										else
										{
											Iterator.figure_rect_outside.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
										}


									} 
									break;
								case 8:									
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,LeftBottom))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/m_fZoomNum)-Iterator.figure_rect_outside.left; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/m_fZoomNum)-Iterator.figure_rect_outside.bottom; 

											if (Iterator.figure_rect_outside.right-MoveDistance_x>=m_RectFigure.right || Iterator.figure_rect_outside.top-MoveDistance_y<=0)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 

												//根据纪念币算法修改
												Iterator.figure_rect_outside.right-=MoveDistance_x;
												Iterator.figure_rect_outside.top-=MoveDistance_y; 

												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
											}
										}
										else
										{
											Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
										}


									} 
									break;
								default:
									break;
								}
								b_find=1;
								break;
							}
						}
					}

				}
				if (b_find==1)
				{					
					break;
				}
			}
			bInvalidate++;
		}

		//平移所有图形
		if (this.b_SubFiguresMove && this.b_FigurePointSelect==false && this.b_LeftButtonDown==true )
		{			
			var FindIterator=new Figure;
			var FindIndex=0;			
			for(FindIndex;FindIndex<this.m_FiguresSet.m_nFigureCount;FindIndex++)
			{  
				FindIterator=this.m_FiguresSet.m_Figures[FindIndex];
				if ((FindIterator.figure_id==this.m_nCursorInFigureId && this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0)
					|| this.b_MoveAllFigures)
				{   
					FindIterator.MoveFigure(this.m_cpDistancePoint.x,this.m_cpDistancePoint.y);
					var b_OutSide=false;
					if (FindIterator.figure_type==DrectType)
					{
						var p1=new CPoint(0,0);
						var p2=new CPoint(0,0); 
						p1.x=GetIntValue(FindIterator.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x;
						p1.y=GetIntValue(FindIterator.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						p2.x=GetIntValue(FindIterator.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x; 
						p2.y=GetIntValue(FindIterator.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						if (this.PointGoOutSide(p1)  || this.PointGoOutSide(p2))
						{
							b_OutSide=true;
						}
						if (b_OutSide)
						{
							FindIterator.MoveFigure(-1*m_cpDistancePoint.x,-1*m_cpDistancePoint.y);
						}
					  }
					else if(FindIterator.figure_type==CircleType)
					{
						var p1=new CPoint(0,0);
						var p2=new CPoint(0,0); 
						p1.x=GetIntValue(FindIterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x;
						p1.y=GetIntValue(FindIterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						p2.x=GetIntValue(FindIterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x; 
						p2.y=GetIntValue(FindIterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						if (this.PointGoOutSide(p1)  || this.PointGoOutSide(p2))
						{
							b_OutSide=true;
						}
						if (b_OutSide)
						{
							FindIterator.MoveFigure(-1*this.m_cpDistancePoint.x,-1*this.m_cpDistancePoint.y);
						} 
					}
					else  //其它的为点组成的图形
					{  
						var PointIterator=new CPoint(0,0);
						var nPointIndex=0;
						var nFindPointIndex=0;
						for (nFindPointIndex;nFindPointIndex<FindIterator.figure_data.nCPointCount;nFindPointIndex++)
						{
							PointIterator=FindIterator.figure_data.m_CPoint[nFindPointIndex];
							var TempPoint=new CPoint(0,0);
							TempPoint.x=GetIntValue(PointIterator.x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x;
							TempPoint.y=GetIntValue(PointIterator.y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
							if(this.PointGoOutSide((TempPoint)))
							{
								b_OutSide=true;
								break;
							}	
							nPointIndex++;						
						}
						if (b_OutSide)
						{
							FindIterator.MoveFigure(-1*m_cpDistancePoint.x,-1*m_cpDistancePoint.y);
						}
					} 
				}				
			}
			bInvalidate++;
		}  
		else if(this.b_SubFiguresMove==false && this.b_FigurePointSelect==false && this.b_LeftButtonDown==true &&  this.b_DrawPoly==false)
		{ 
			this.OriginalPoint_Bitmap.x=this.m_cpDistancePoint.x+this.OriginalPoint_Bitmap.x;
			this.OriginalPoint_Bitmap.y=this.m_cpDistancePoint.y+this.OriginalPoint_Bitmap.y;  
			bInvalidate++;
		} 
		this.m_cpOriginalPoint_cursor.x=this.m_cpCurrentPoint_cursor.x;
		this.m_cpOriginalPoint_cursor.y=this.m_cpCurrentPoint_cursor.y; 

	}     
	if (bInvalidate>0)
	{
		this.RepaintControl();
	}
}

function PreTranslateMessage(msg)
{}

//可以用document.geElementByClassName()获取类，但是IE10之前不支持，所以封装一个取class的方法
function getByClass(clsName,parent){
	var oParent=parent?document.getElementById(parent):document,
		eles=[],
		elements=oParent.getElementsByTagName('*');
	for(var i=0,l=elements.length;i<l;i++){     //同时初始化多个变量
		if(elements[i].className==clsName){
			eles.push(elements[i]);
		}
	}
	return eles;
}

window.onload = drag;
	//点击标题区域
function drag(){
	var oTitle=getByClass("login_logo_webqq","loginPanel")[0];
	//鼠标按下
	oTitle.onmousedown=fndown;
	//关闭面板
	var oClose=getByClass("ui_boxyClose","loginPanel")[0];
	oClose.onclick=function(){
		document.getElementById("loginPanel").style.display="none";
	}
	//状态列表
	var loginState=document.getElementById("loginState"),
		stateList=document.getElementById("loginStatePanel"),
		loginStateShow=document.getElementById("loginStateShow"),
		list=stateList.getElementsByTagName("li"),
		stateTxt=document.getElementById("login2qq_state_txt");
	//点击状态列表区域
	loginState.onclick=function(e){
		//阻止事件冒泡
		e=e || window.e;
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancleBubble=true;
		}
		stateList.style.display='block';
	}
	//鼠标划过、离开、点击状态列表选项时
	for(var i=0,l=list.length;i<l;i++){
		list[i].onmouseover=function(){
			this.style.backgroundColor="#567";
		}
		list[i].onmouseout=function(){
			this.style.backgroundColor="#fff";
		}
		list[i].onclick=function(e){
			stateList.style.display='none';
			//阻止事件冒泡
			e=e || window.e;
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancleBubble=true;
			}
			stateTxt.innerHTML=getByClass('stateSelect_text',this.id)[0].innerHTML;
			loginStateShow.className='login-state-show '+this.id;
		}
	}
	//点其他地方隐藏列表
	document.onclick=function(){
		stateList.style.display='none';
	}
}

function fndown(){
	var oDrag=document.getElementById("loginPanel"),
		//获取按下鼠标时，鼠标距离面板左、上的距离
		disX=event.clientX-oDrag.offsetLeft,
		disY=event.clientY-oDrag.offsetTop;
	
	//移动鼠标
	document.onmousemove=function(event){
		var x=event.clientX-disX,
			y=event.clientY-disY,
		//获取视窗宽度
			winW=document.documentElement.clientWidth || document.body.clientWidth,
			winH=document.documentElement.clientHeight || document.bodu.clientHeight,
			maxW=winW-oDrag.offsetWidth,
			maxH=winH-oDrag.offsetHeight; 
		//限制窗口移动范围
		if(x<0){
			x=0;
		}else if(x>maxW-10){
			x=maxW-10;
		}
		oDrag.style.left=x+'px';
		if(y<10){
			y=10;	
		}else if(y>maxH){
			y=maxH;
		}
		oDrag.style.top=y+'px';
	}
	//释放鼠标
	document.onmouseup=function(event){
		document.onmousemove=null;
		document.onmouseup=null;
	}
}
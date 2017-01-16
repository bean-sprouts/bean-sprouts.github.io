//������document.geElementByClassName()��ȡ�࣬����IE10֮ǰ��֧�֣����Է�װһ��ȡclass�ķ���
function getByClass(clsName,parent){
	var oParent=parent?document.getElementById(parent):document,
		eles=[],
		elements=oParent.getElementsByTagName('*');
	for(var i=0,l=elements.length;i<l;i++){     //ͬʱ��ʼ���������
		if(elements[i].className==clsName){
			eles.push(elements[i]);
		}
	}
	return eles;
}

window.onload = drag;
	//�����������
function drag(){
	var oTitle=getByClass("login_logo_webqq","loginPanel")[0];
	//��갴��
	oTitle.onmousedown=fndown;
	//�ر����
	var oClose=getByClass("ui_boxyClose","loginPanel")[0];
	oClose.onclick=function(){
		document.getElementById("loginPanel").style.display="none";
	}
	//״̬�б�
	var loginState=document.getElementById("loginState"),
		stateList=document.getElementById("loginStatePanel"),
		loginStateShow=document.getElementById("loginStateShow"),
		list=stateList.getElementsByTagName("li"),
		stateTxt=document.getElementById("login2qq_state_txt");
	//���״̬�б�����
	loginState.onclick=function(e){
		//��ֹ�¼�ð��
		e=e || window.e;
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancleBubble=true;
		}
		stateList.style.display='block';
	}
	//��껮�����뿪�����״̬�б�ѡ��ʱ
	for(var i=0,l=list.length;i<l;i++){
		list[i].onmouseover=function(){
			this.style.backgroundColor="#567";
		}
		list[i].onmouseout=function(){
			this.style.backgroundColor="#fff";
		}
		list[i].onclick=function(e){
			stateList.style.display='none';
			//��ֹ�¼�ð��
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
	//�������ط������б�
	document.onclick=function(){
		stateList.style.display='none';
	}
}

function fndown(){
	var oDrag=document.getElementById("loginPanel"),
		//��ȡ�������ʱ��������������ϵľ���
		disX=event.clientX-oDrag.offsetLeft,
		disY=event.clientY-oDrag.offsetTop;
	
	//�ƶ����
	document.onmousemove=function(event){
		var x=event.clientX-disX,
			y=event.clientY-disY,
		//��ȡ�Ӵ����
			winW=document.documentElement.clientWidth || document.body.clientWidth,
			winH=document.documentElement.clientHeight || document.bodu.clientHeight,
			maxW=winW-oDrag.offsetWidth,
			maxH=winH-oDrag.offsetHeight; 
		//���ƴ����ƶ���Χ
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
	//�ͷ����
	document.onmouseup=function(event){
		document.onmousemove=null;
		document.onmouseup=null;
	}
}
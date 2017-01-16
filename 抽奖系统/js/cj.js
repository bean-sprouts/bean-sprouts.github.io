var data=['Iphone7','Ipad','联想笔记本电脑','100元抵用券','1000元油卡','谢谢参与','小米电视机'],
	timer=null;
	flag=true;

window.onload = function(){
	var start=document.getElementById('start'),
		stop=document.getElementById('stop');
	//开始抽奖
	start.onclick=startFun;
	//停止抽奖
	stop.onclick=stopFun;
	//键盘事件
	document.onkeyup=function(e){
		e=e || e.element;
		if(e.keyCode==13){
			if(flag==true){
				startFun();
				flag=false;
			}else{
				stopFun();
				flag=true;
			}
		}
	}
}
function startFun(){
	var start=document.getElementById('start'),
		title=document.getElementById('title');
	//加定时器值钱需要关一个定时器，否则多次点击会打开多个定时器
	clearInterval(timer);
	timer=setInterval(function(){
		var random=Math.floor(Math.random()*data.length);
		title.innerHTML = data[random];
	},50)
	start.style.background='#999';
}
function stopFun(){
	var start=document.getElementById('start'),
		title=document.getElementById('title');
	clearInterval(timer);
	start.style.background='blue';
}
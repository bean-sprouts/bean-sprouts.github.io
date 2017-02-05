/* 雷达图组件对象 */
var H5ComponentRadar=function(name,cfg){
    var component = new H5ComponentBase(name,cfg);
    var w=cfg.width;
    var h=cfg.height;
        
    //加入画布--背景层
    var cns=document.createElement('canvas');
    var ctx=cns.getContext('2d');
    cns.width=ctx.width=w;
    cns.height=ctx.height=h;
    component.append(cns);
    
    var x=0;
    var y=0;
    var r=w/2;
    //画多边形
    
    var step=cfg.data.length;
    //ctx.translate(r,r);
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.strokeStyle='#AAAAAA';
    
    ctx.arc(r,r,r-5,0,2*Math.PI);
    ctx.stroke();
    //绘制网格背景（分为10份）
    var flag= false;
    for(var s=10;s>0;s--){
    //画线
    ctx.beginPath();
        for(i=0;i<step;i++){
            var rad=2*Math.PI/step*i;
            x=r+Math.cos(rad)*r*(s/10);
            y=r+Math.sin(rad)*r*(s/10);
            ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.fillStyle=(flag=!flag) ? '#99c0ff' : '#f1f9ff';
        ctx.fill();
    }
    //绘制伞骨
    for(i=0;i<step;i++){
            rad=2*Math.PI/step*i;
            x=r+Math.cos(rad)*r;
            y=r+Math.sin(rad)*r;
            ctx.moveTo(r,r);
            ctx.lineTo(x,y);
            //输出项目文字
            var text=$('<div class="text">');
            text.text(cfg.data[i][0]);
            
            //延时显示
            text.css('transition','all .5s '+i*.2+'s');
            
            if(x>w/2){
                text.css('left',x/2+5); 
            }else{
                text.css('right',(w-x)/2+5)
            }
            if(y>h/2){
                text.css('top',y/2+5);
            }else{
                text.css('bottom',(h-y)/2+5);
            }
            if(cfg.data[i][2]){
                text.css('color',cfg.data[i][2]);
            }
            text.css('opacity',0);
            
            component.append(text);
            
    }
    ctx.strokeStyle='#e0e0e0';
    ctx.stroke();
    
    //加入画布--数据层
    var cns=document.createElement('canvas');
    var ctx=cns.getContext('2d');
    cns.width=ctx.width=w;
    cns.height=ctx.height=h;
    component.append(cns);
    
    ctx.strokeStyle='#f00';
    function draw(per){
        if(per>=1){
            component.find('.text').css('opacity',1);
        }else{
            component.find('.text').css('opacity',0);
        }
        //清理画布
        ctx.clearRect(0,0,w,h);
        //画线
        ctx.beginPath();
        ctx.lineWidth=2;
        for(var i=0;i<step;i++){
            var item=cfg.data[i];
            var rad=2*Math.PI/step*i;
            var rate=cfg.data[i][1]*per;
            
            var x=r+Math.cos(rad)*r*rate;
            var y=r+Math.sin(rad)*r*rate;
            
            ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.stroke();
        //画数据的点
        ctx.fillStyle='#ff7676';
        for(i=0;i<step;i++){
            item=cfg.data[i];
            rad=2*Math.PI/step*i;
            rate=cfg.data[i][1]*per;
            
            x=r+Math.cos(rad)*r*rate;
            y=r+Math.sin(rad)*r*rate;
            
            ctx.beginPath();
            ctx.arc(x,y,5,0,2*Math.PI);
            
            ctx.fill();
        }
    };
    
    component.on('onLoad',function(){
        //折线图生长动画
        var s=0;
        for(i=0;i<100;i++){
            setTimeout(function(){
                s+=.01;
                draw(s);
            },i*10+500);
        }
    });
    
    component.on('onLeave',function(){
        //折线图生长动画
        var s=1;
        for(i=0;i<100;i++){
            setTimeout(function(){
                s-=.01;
                draw(s);
            },i*10);
        }
    });
    
    return component;
};
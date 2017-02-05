/* 饼图组件对象 */
var H5ComponentPie=function(name,cfg){
    var component = new H5ComponentBase(name,cfg);
    
    var w=cfg.width;
    var h=cfg.height;
        
    //加入画布--背景层
    var cns=document.createElement('canvas');
    var ctx=cns.getContext('2d');
    cns.width=ctx.width=w;
    cns.height=ctx.height=h;
    $(cns).css('z-index',1);
    component.append(cns);
    
    var r=w/2;
    var step=cfg.data.length;
    ctx.beginPath();
    //重新映射画布的（0,0）位置
    ctx.translate(r,r);
    ctx.fillStyle='#eee';
    ctx.arc(0,0,r,0,2*Math.PI);
    
    ctx.fill();
    
    //加入画布--数据层
    cns=document.createElement('canvas');
    ctx=cns.getContext('2d');
    cns.width=ctx.width=w;
    cns.height=ctx.height=h;
    $(cns).css('z-index',2);
    component.append(cns);
    
    var startAngle=1.5*Math.PI;
    var stopAngle=0;
    var aAngle=2*Math.PI;
    var color=['purple','orange','pink','skyblue','red','blue','yellow','green','grey'];//备用颜色

    //绘制数据层
    ctx.translate(r,r);
    for(var i=0;i<step;i++){
        var item=cfg.data[i];
        stopAngle=startAngle+aAngle*item[1];
        
        ctx.beginPath();
        ctx.fillStyle=item[2] ? item[2] : color.pop();
        ctx.moveTo(0,0);
        ctx.arc(0,0,r-1,startAngle,stopAngle);
        ctx.fill();
        //绘制指示线
        /*var middleAngle=stopAngle-(stopAngle-startAngle)/2;
        var cos=Math.cos(middleAngle);
        var sin=Math.sin(middleAngle);
        
        ctx.beginPath();
        ctx.moveTo(cos*(r-20),sin*(r-20));
        ctx.lineWidth=2;
        ctx.lineTo(Math.cos(stopAngle)*(r+50),Math.sin(stopAngle)*(r+50));
        
        ctx.stroke();*/
        
        //加入项目文本以及百分比
        var text=$('<div class="text">');
        text.text(item[0]);
        var per=$('<div class="per">');
        per.text((item[1]*100 >> 0)+'%');
        text.append(per);
        
        var x=r+Math.cos(startAngle+(stopAngle-startAngle)/2)*r;
        var y=r+Math.sin(startAngle+(stopAngle-startAngle)/2)*r;
        
        if(x>w/2){
            text.css('left', x/2);
        }else{
            text.css('right',w/2-x/2);
        }
        if(y>h/2){
            text.css('top',y/2);
        }else{
            text.css('bottom',h/2-y/2);
        }
        
        if(item[2]){
            text.css('color',item[2]);
        }
        text.css('opacity',0);
        
        startAngle=stopAngle;
        component.append(text);
    }
    
    //加入画布--遮罩动画层
    cns=document.createElement('canvas');
    ctx=cns.getContext('2d');
    cns.width=ctx.width=w;
    cns.height=ctx.height=h;
    $(cns).css('z-index',3);
    component.append(cns);
    
    ctx.fillStyle='#eee';
    ctx.translate(r,r);
    function draw(per){
        if(per>=1){
            H5ComponentPie.reSort(component.find('.text'));
            component.find('.text').css('transition',function(index,value){
                return 'all .5s '+.2*index+'s';
            });
            component.find('.text').css('opacity',1);
        }else{
            component.find('.text').css('opacity',0);
        }
        ctx.clearRect(-r,-r,w,h);
        ctx.beginPath();
        ctx.moveTo(0,0);
        if(per<=0){
            ctx.arc(0,0,r,0,2*Math.PI);
        }else{
            ctx.arc(0,0,r,1.5*Math.PI,1.5*Math.PI+(2*Math.PI)*per,true); 
        }
        
        ctx.fill();
    }
    draw(0);
    component.on('onLoad',function(){
        //饼图生长动画
        var s=0;
        for(i=0;i<100;i++){
            setTimeout(function(){
                s+=.01;
                draw(s);
            },i*10+500);
        }
    });
    
    component.on('onLeave',function(){
        //饼图生长动画
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

H5ComponentPie.reSort = function(list){
   
    //1、检测相交
    var compare = function(domA,domB){
        //计算元素位置要用offset，因为有时候css的left为auto
        //domA的投影x,y坐标
        var offsetA=$(domA).offset();
        var shadowA_x=[offsetA.left,offsetA.left+$(domA).width()];
        var shadowA_y=[offsetA.top,offsetA.top+$(domA).height()];
        //domB的投影x,y坐标
        var offsetB=$(domB).offset();
        var shadowB_x=[offsetB.left,offsetB.left+$(domB).width()];
        var shadowB_y=[offsetB.top,offsetB.top+$(domB).height()];
        //检测x方向是否相交
        var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1]) || (shadowB_x[0] > shadowA_x[0] && shadowB_x[0] < shadowA_x[1]) ;
        //检测y方向是否相交
        var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1]) || (shadowB_y[0] > shadowA_y[0] && shadowB_y[0] < shadowA_y[1]);
        
        return intersect_x && intersect_y;
    }
    //2、文本重排
    var reset = function(domA,domB){
        //domA的投影x,y坐标
        var offsetA=$(domA).offset();
        var shadowA_x=[offsetA.left,offsetA.left+$(domA).width()];
        var shadowA_y=[offsetA.top,offsetA.top+$(domA).height()];
        //domB的投影x,y坐标
        var offsetB=$(domB).offset();
        var shadowB_x=[offsetB.left,offsetB.left+$(domB).width()];
        var shadowB_y=[offsetB.top,offsetB.top+$(domB).height()];
        
        if(shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1]){
            //x轴重叠范围大小
            var intersection_x=(shadowA_x[1]<shadowB_x[1]) ? $(domA).width() : (shadowB_x[1]-shadowA_x[0]);
            //移动方向标志
            var moveLeftA=false;
        }else if(shadowB_x[0] > shadowA_x[0] && shadowB_x[0] < shadowA_x[1]){
            var intersection_x=(shadowB_x[1]<shadowA_x[1]) ? $(domB).width() : (shadowA_x[1]-shadowB_x[0]);
            var moveLeftA=true;
        }
        if(shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1]){
            var intersection_y=(shadowA_y[1]<shadowB_y[1]) ? $(domA).height() : (shadowB_y[1]-shadowA_y[0]);
            var moveTopA=false;
        }else if(shadowB_y[0] > shadowA_y[0] && shadowB_y[0] < shadowA_y[1]){
            var intersection_y=(shadowB_y[1]<shadowA_y[1]) ? $(domB).height() : (shadowA_y[1]-shadowB_y[0]);
            var moveTopA=true;
        }
        if(intersection_x < intersection_y){
            //右边的元素
            if($(domA).css('left') != 'auto'){
                if(!moveLeftA){
                    $(domA).css('left',parseInt($(domA).css('left'))+Math.ceil(intersection_x));
                }else{
                    $(domB).css('left',parseInt($(domB).css('left'))+Math.ceil(intersection_x));
                }
            }
            //左边的元素
            if($(domA).css('right') != 'auto'){
                if(moveLeftA){
                    $(domA).css('right',parseInt($(domA).css('right'))+Math.ceil(intersection_x));
                }else{
                    $(domB).css('right',parseInt($(domB).css('right'))+Math.ceil(intersection_x));
                }
            } 
        }else{
            if($(domA).css('top') != 'auto'){
                if(!moveTopA){
                    $(domA).css('top',parseInt($(domA).css('top'))+Math.ceil(intersection_y));
                }else{
                    $(domB).css('top',parseInt($(domB).css('top'))+Math.ceil(intersection_y));
                }
            }
            if($(domB).css('bottom') != 'auto'){
                if(moveTopA){
                    $(domA).css('bottom',parseInt($(domA).css('bottom'))+Math.ceil(intersection_y));
                }else{
                    $(domB).css('bottom',parseInt($(domB).css('bottom'))+Math.ceil(intersection_y));
                }
            }
        }
    }
    var willReset=[];
    
    $.each(list,function(index,item){
        $.each(list,function(i,domTarget){
            if(compare(item,domTarget)){
                willReset.push(item);
            }
        });
    });
    
    if(willReset.length>1){
        $.each(willReset,function(idx,domA){
           if(willReset[idx+1]){
               reset(domA,willReset[idx+1]);
           } 
        });
        
        H5ComponentPie.reSort(willReset);
    }
}
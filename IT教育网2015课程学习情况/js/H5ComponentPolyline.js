/* 柱图组件对象 */
var H5ComponentPolyline=function(name,cfg){
    var component = new H5ComponentBase(name,cfg);
    var w=cfg.width;
    var h=cfg.height;
        
        //加入画布--背景层
        var cns=document.createElement('canvas');
        var ctx=cns.getContext('2d');
        cns.width=ctx.width=w;
        cns.height=ctx.height=h;
        component.append(cns);
        
        //绘制网格线
        var step=10;//分多少个横，高度等分
        
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle='#AAAAAA';
    
        for(var i=0;i<step+1;i++){
            var y=i*(h/step);
            ctx.moveTo(0,y);
            ctx.lineTo(w,y);
        }
        //垂直网格线
        step=cfg.data.length+1;
        var text_w=w/step;
        for(i=0;i<step+1;i++){
            var x=i*(w/step);
            ctx.moveTo(x,0);
            ctx.lineTo(x,h);
            //项目文本
            if(cfg.data[i]){
                var text=$('<div class="text">');
                text.text(cfg.data[i][0]);
                text.css({
                    'width': text_w/2,
                    'left': x/2+text_w/2-text_w/4,
                    'transition': 'all 1s '+(i+1)*.3+'s'
                });
                
                component.append(text);
            }
        }
        
        ctx.stroke();
    
    
        //加入画布--数据层
        //新建一个canvas画折线图，因为折线图有动画效果
        
        cns=document.createElement('canvas');
        ctx=cns.getContext('2d');
        cns.width=ctx.width=w;
        cns.height=ctx.height=h;
        component.append(cns);
        
    /**
     * 绘制折线以及折线的数据和阴影
     * @param  {floot} per 0到1之间的数据，根据这个值绘制中间状态
     * @return {} component元素
     */
    function draw(per){
        //清空画布
        ctx.clearRect(0,0,w,h);
        
        //绘制折现图
        ctx.beginPath();
        ctx.lineWidth=3;
        ctx.strokeStyle='#ff8878';
        
        x=0;
        y=0;
        
        //ctx.moveTo(0,0);
        //ctx.arc(10,10,5,0,2*Math.PI);
        
        var row_w=w/(cfg.data.length+1);
        for(i=0;i<cfg.data.length;i++){
            var item=cfg.data[i];
            x=row_w*i+row_w;
            y=h-(item[1])*h*per;
            //连线
            ctx.lineTo(x,y);
            //画点
            ctx.moveTo(x+5,y);
            ctx.arc(x,y,5,0,2*Math.PI);
            //项目文本
            //无法漂浮出画布，改为新增DOM元素
            //ctx.fillText(item[0],x,20);
            //写数据
            ctx.font='18px Arial';
            ctx.textAlign='center';
            ctx.fillStyle=item[2] ? item[2] : '#595959';
            ctx.fillText(((item[1]*100)>>0)+'%',x+10,y-20);//转换为百分比并去小数位
            ctx.moveTo(x,y);
        }
        
        ctx.stroke();
        
        //绘制阴影
     
        ctx.beginPath();
        ctx.moveTo(row_w,h);
        for (i in cfg.data){
            item=cfg.data[i];
            x=row_w*i+row_w;
            y=h-item[1]*h*per;
            ctx.lineTo(x,y);    
        }
        ctx.lineTo(row_w*cfg.data.length,h);
        ctx.closePath();
        ctx.fillStyle='rgba(255,118,118,0.3)';
        ctx.fill();
        
        //连线
        //ctx.moveTo(row_w,(1-cfg.data[0][1])*h);
        //ctx.arc(row_w,(1-cfg.data[0][1])*h,35,0,2*Math.PI);
        //for (i in cfg.data){
        //    var item=cfg.data[i];
        //    x=row_w*i+row_w;
        //    y=(1-item[1])*h;
        //    ctx.lineTo(x,y);    
        //}
        
    }
    
    component.on('onLoad',function(){
        //折线图生长动画
        var s=0;
        draw(s);
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
        draw(s);
        for(i=0;i<100;i++){
            setTimeout(function(){
                s-=.01;
                draw(s);
            },i*10);
        }
    });
    
    
    return component;
};
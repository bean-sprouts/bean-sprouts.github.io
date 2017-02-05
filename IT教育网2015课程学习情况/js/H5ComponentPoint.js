/* 散点图表组件对象 */
var H5ComponentPoint = function(name,cfg){
    var component = new H5ComponentBase(name,cfg);
    //以第一项为基础设置后面几项的大小
    var  base=cfg.data[0][1]; //0.4
    
    //输出每一个point
    $.each(cfg.data,function(index,key){
        var point=$('<div class="point point_'+index+'">');
        
        var name=$('<div class="name">'+key[0]+'</div>');
        var rate=$('<div class="per">'+(key[1]*100)+'%</div>')
        
        rate.appendTo(name);
        point.append(name);
        
        //计算大小基于第一项的比例
        var per=(key[1]/base*100)+'%';
        point.width(per).height(per);
        
        //颜色为可选条件
        if(key[2]){
            point.css('background-color',key[2]);
        }
        if(key[3] != undefined && key[4] != undefined){
            point.css({
                'left':key[3],
                'top':key[4]
            });
        }
        point.css('transition','all 1s '+index*.7+'s');
        component.append(point);
        
        component.find('.point').eq(0).addClass('point_focus');
        component.find('.point').on('click',function(){
            component.find('.point').removeClass('point_focus');
            $(this).addClass('point_focus');
            return false;
        });
       
    });
    
    return component;
}
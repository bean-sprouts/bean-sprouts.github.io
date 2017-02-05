/* 环图组件对象 */
var H5ComponentRing = function(name,cfg){
    cfg.data.length=1;
    //利用pie的JS和CSS样式
    cfg.type='pie';
    var component=new H5ComponentPie(name,cfg);
    var mask=$('<div class="mask">');
    var w=cfg.width/2;
    var h=cfg.height/2;
    //修正组件样式
    component.addClass('h5_component_ring');
    mask.css({
        'width':.8*w,
        'height':.8*h
    });
    component.find('.text').css({
        'left': '50%',
        'top': '50%'
    }).appendTo(mask);
    
    component.append(mask);
    return component;
};
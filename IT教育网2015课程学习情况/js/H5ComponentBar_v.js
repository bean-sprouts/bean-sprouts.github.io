/* 垂直柱图组件对象 */
var H5ComponentBar_v=function(name,cfg){
    var component = new H5ComponentBar(name,cfg);
    
    //获取每个元素的宽度
    component.find('.rate').each(function(i,ele){
        $(this).css({
            'width': '20px',
            'height': $(ele).width()+'%'
        });
    });
    
    return component;
};
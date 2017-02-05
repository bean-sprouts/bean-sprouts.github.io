/* 基本图文组件对象 */
var H5ComponentBase = function(name,cfg){
    cfg=cfg || {};
    var id=('h5_c_'+Math.random()).replace('.','_');
    var cls='h5_component_'+cfg.type+' h5_component_name_'+name;
    var component=$('<div class="h5_component '+cls+'" id="'+id+'">');
    cfg.text   && component.text(cfg.text);
    cfg.width  && component.width(cfg.width/2);
    cfg.height && component.height(cfg.height/2);
    cfg.css    && component.css(cfg.css);
    cfg.bg     && component.css('backgroundImage','url('+cfg.bg+')');
    if(cfg.center === true){
        component.css({
            'left': '50%',
            'margin-left': cfg.width/4*-1+'px'
        });
    }
    if(cfg.relativeTo != undefined){
        var obj=$('.h5_component_name_logo');
        var x=cfg.center===true?0:obj[0].offsetLeft;
        var y=obj[0].offsetTop;
        component.css({
            'transform':'translate('+x+'px,'+y+'px)',
            '-ms-transform':'translate('+x+'px,'+y+'px)', 	// IE 9 
            '-moz-transform':'translate('+x+'px,'+y+'px)',	// Firefox 
            '-webkit-transform':'translate('+x+'px,'+y+'px)', // Safari 和 Chrome 
            '-o-transform':'translate('+x+'px,'+y+'px)', 	// Opera 
        });
    }
    if(typeof cfg.onclick === 'function'){
        component.on('click',cfg.onclick);
    }
    
    component.on('onLoad',function(){
        setTimeout(function(){
            component.addClass('h5_component_'+cfg.type+'_load').removeClass('h5_component_'+cfg.type+'_leave');
            cfg.animateIn && component.animate(cfg.animateIn);
        },cfg.delay || 0);
        return false;
    });
    component.on('onLeave',function(){
        setTimeout(function(){
            component.addClass('h5_component_'+cfg.type+'_leave').removeClass('h5_component_'+cfg.type+'_load');
            cfg.animateOut && component.animate(cfg.animateOut);
        },0);
        return false;
    });
    return component;
}
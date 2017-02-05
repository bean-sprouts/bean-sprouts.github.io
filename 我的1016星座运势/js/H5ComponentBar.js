/* 柱图组件对象 */
var H5ComponentBar=function(name,cfg){
    var component = new H5ComponentBase(name,cfg);
    $.each(cfg.data,function(idx,item){
        var line=$('<div class="line">');
        var name=$('<div class="name">');
        var rate=$('<div class="rate">');
        var per=$('<div class="per">');
        var w=item[1]*100+'%';
        var bgStyle='';
        
        if(item[2]){
            bgStyle='style="background-color:'+item[2]+'"';
        }
        
        name.text(item[0]);
        rate.css('width',w);
        rate.html('<div class="bg"'+bgStyle+'></div>')
        per.text(w);
        
        name.css('color',item[2] ? item[2] : '#99c0ff');
        per.css('color',item[2] ? item[2] : '#99c0ff');
        line.append(name);
        rate.append(per);
        line.append(rate);
        
        
        
        line.appendTo(component);
    });
    
    
    return component;
};
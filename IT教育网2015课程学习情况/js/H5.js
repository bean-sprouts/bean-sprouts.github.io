/* 内容管理对象 */
var H5=function(){
    this.id=('h5_'+Math.random()).replace('.','_');
    this.el=$('<div class="h5" id="'+this.id+'">').hide();
    this.page=[];
    $('body').append(this.el);
    /*新增一个页*/
    /**
     * [addPage description]
     * @param {string} name 页的名称，会加入到className中
     * @param {string} text 页内的默认文本
     * @return {H5} H5对象，可以重复使用H5对象支持的方法
     * **/
    this.addPage=function(name,text){
        var page=$('<div class="h5_page section">');
        name && page.addClass('h5_page_'+name);
        text && page.text(text);
        this.el.append(page);
        this.page.push(page);
        
        if(typeof this.whenAddPage === 'function'){
            this.whenAddPage();
        }
        return this;
    }
    
    /*新增一个组件*/
    this.addComponent=function(name,cfg){
        cfg=cfg || {};
        cfg=$.extend({type:'base'},cfg);//合并对象，实现为设置类型则默认为base
        var component;
        var page=this.page.slice(-1)[0];//从数组中某个位置取元素，-1表示从后往前取
        switch(cfg.type){
            case 'base':
                component = new H5ComponentBase(name,cfg);
                break;
            case 'polyline':
                component = new H5ComponentPolyline(name,cfg);
                break;
            case 'bar':
                component = new H5ComponentBar(name,cfg);
                break;
            case 'bar_v':
                component = new H5ComponentBar_v(name,cfg);
                break;
            case 'pie':
                component = new H5ComponentPie(name,cfg);
                break;
            case 'point':
                component = new H5ComponentPoint(name,cfg);
                break;
            case 'radar':
                component = new H5ComponentRadar(name,cfg);
                break;
            case 'ring':
                component = new H5ComponentRing(name,cfg);
                break;
            default:
        }
        page.append(component);
        return this;
    }
    /*H5对象初始化*/
    this.loader=function(firstPage){
        this.el.fullpage({
            'onLeave':function(index,nextIndex,direction){
                    $(this).find('.h5_component').trigger('onLeave');
                    },
            'afterLoad':function(anchorLink,index){
                    $(this).find('.h5_component').trigger('onLoad');
                }
        });
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
        if(firstPage){
            $.fn.fullpage.moveTo(firstPage);
        }
    } 
    this.loader=(typeof H5_loading === 'function') ? H5_loading : this.loader; 
    return this;
}
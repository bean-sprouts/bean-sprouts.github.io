/**
 * Created by Minnie on 2017/1/19.
 */
//动画分为三个部分，初始场景、粽子展开动画、托盘旋转动画
var s1 = new TimeLine();
var s2 = new TimeLine();
var s3 = new TimeLine();
//初始场景
s1.add(1,function () {
    getId('c_zongzi_box').addClass('c_zongzi_box_rock');
    getId('c_shengzi').onclick = function () {
        s2.start();
    };
},'粽子抖动');
//绳子动画场景
s2.add(1,function () {
    getId('c_zongzi_box').removeClass('c_zongzi_box_rock');
    getId('text').addClass('text_in');
},'停止粽子抖动');
s2.add(100,function () {
    getId('c_shengzi').className = 'c_shengzi_2';
},'绳子动画2');
s2.add(500,function () {
    getId('c_shengzi').className = 'c_shengzi_3';
},'绳子动画3');
s2.add(1000,function () {
    getId('c_shengzi').className = 'c_shengzi_4';
    getId('caption').addClass('caption_rock');
},'绳子动画4');
s2.add(1500,function () {
    getId('c_shengzi').className = 'c_shengzi_out';
},'绳子消失');
s2.add(2000,function () {
    getId('c_zongzi').addClass('c_zongzi_out');
    getId('c_zongzirou').addClass('c_zongzirou_in');
    getId('c_zuoye').addClass('c_zuoye_in');
    getId('c_youye').addClass('c_youye_in');
    getId('c_t_jx').addClass('c_t_jx_in');
    getId('c_t_ry').addClass('c_t_ry_in');
    getId('c_t_ry').addClass('c_t_mirror_1');
},'粽子消失，粽子肉入场');
//粽子展开动画
s2.add(3000,function () {
    getId('c_zuoye').removeClass('c_zuoye_in').addClass('c_zuoye_out');
    getId('c_youye').removeClass('c_youye_in').addClass('c_youye_out');
},'左右页消失');
s2.add(3500,function () {
    getId('c_diye').addClass('c_diye_in');
    s3.start();
},'底叶出现');
//托盘旋转动画
s3.add(1000,function () {
    getId('c_zongzirou').addClass('c_zongzirou_view_2');
    getId('c_t_jx').addClass('c_t_view_2');
    getId('c_t_ry').removeClass('c_t_mirror_1').addClass('c_t_mirror_2');
});
s3.add(1300,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_2').addClass('c_zongzirou_view_3');
    getId('c_t_jx').removeClass('c_t_view_2').addClass('c_t_view_3');
    getId('c_t_ry').removeClass('c_t_mirror_2').addClass('c_t_mirror_3');
});
s3.add(1600,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_3').addClass('c_zongzirou_view_4');
    getId('c_t_jx').removeClass('c_t_view_3').addClass('c_t_view_4');
    getId('c_t_ry').removeClass('c_t_mirror_3').addClass('c_t_mirror_4');
});
s3.add(1900,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_4').addClass('c_zongzirou_view_0');
    getId('c_t_jx').removeClass('c_t_view_4').addClass('c_t_view_0');
    getId('c_t_ry').removeClass('c_t_mirror_4').addClass('c_t_mirror_0');
});
s3.add(2900,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_0').addClass('c_zongzirou_view_4');
    getId('c_t_jx').removeClass('c_t_view_0').addClass('c_t_view_4');
    getId('c_t_ry').removeClass('c_t_mirror_0').addClass('c_t_mirror_4');
});
s3.add(3200,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_4').addClass('c_zongzirou_view_3');
    getId('c_t_jx').removeClass('c_t_view_4').addClass('c_t_view_3');
    getId('c_t_ry').removeClass('c_t_mirror_4').addClass('c_t_mirror_3');
});
s3.add(3500,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_3').addClass('c_zongzirou_view_2');
    getId('c_t_jx').removeClass('c_t_view_3').addClass('c_t_view_2');
    getId('c_t_ry').removeClass('c_t_mirror_3').addClass('c_t_mirror_2');
});
s3.add(3700,function () {
    getId('c_zongzirou').removeClass('c_zongzirou_view_2');
    getId('c_t_jx').removeClass('c_t_view_2');
    getId('c_t_ry').removeClass('c_t_mirror_2').addClass('c_t_mirror_1');
});
s3.add(4000,function () {
    s3.start();
});

//图片加载器，解决第一次打开页面动画闪烁问题
var imgs = ['images/zzr_1.png','images/zzr_2.png','images/zzr_3.png','images/zzr_4.png'];

for(var i=0;i<imgs.length;i++){
    var img = new Image();
    img.src = imgs[i];
    img.onload = function () {
        imgs.pop();
        if(imgs.length === 0){
            s1.start();
        }
    };
}
//根据ID获取元素
function getId(id) {
    var ele = document.getElementById(id);
    //添加类名方法
    ele.addClass = function (cName) {
        if (cName){
            ele.className += ' ' + cName;
        }
        return this;
    };
    //删除类名方法
    ele.removeClass = function (cName) {
        if(cName){
            ele.className = ele.className.replace(' '+cName,'');
        }else{
            ele.className = '';
        }
        return this;
    };
    return ele;
}

// 构建一个延时函数
//需要参数延时时间、回调函数、日志
function TimeLine() {
    var _this = this;
    _this.order = [];//动画序列
    _this.add = function (timeout,func,log) {
        _this.order.push({
            timeout: timeout,
            func: func,
            log: log
        });
    };
    _this.start = function (startTime) {
        var i;
        for(i=0;i<_this.order.length;i++){
            (function (arg) {
                var fn = arg.func
                    ,timeout = arg.timeout
                    ,log = arg.log
                    ;
                // if(startTime){
                //     timeout = timeout < startTime ? 0 : (timeout-startTime);
                // }
                timeout = Math.max(timeout-(startTime || 0),0);
                setTimeout(fn,timeout);
                if(!log) return;
                setTimeout(function () {
                    console.log('timeout-->',timeout,'log-->',log);
                },timeout);
            })(_this.order[i]);
        }
    }
}
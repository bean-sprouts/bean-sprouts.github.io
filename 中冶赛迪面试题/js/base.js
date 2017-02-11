//下拉菜单初始化
$('.dropdown-button').dropdown({
    hover: true,
    belowOrigin: true
});
<!-- 折叠导航初始化 -->
$(".button-collapse").sideNav({
    edge: 'right'
});
$('.modal').modal();
(function () {
    //DOM对象
    var DOM = {
        window: $(window),
        document: $(document),
        body: $('body'),
        thead: $('thead'),
        tbody: $('tbody'),
        pagination: $('.pagination'),
        rows_total: $('#rows_total'),
        data_total: $('#data_total'),
        modal: $('.modal'),
        alert_box: $('#alert_box'),
        alert_box_mask: $('#alert_box_mask')
    };

    var currentPage = 1
        , pages
        , rows
        , rowNum
        , startNum = 1  //分页导航起始页
        , total = 0       //记录数据数
        ;
    if (DOM.window.height() < 600) {
        rowNum = 3;
    } else if (DOM.window.height() > 1000) {
        rowNum = 15;
    } else {
        rowNum = 10;
    }
    //分页,设置每页行数
    init();
    //屏幕高度低于600时，每页显示6行
    //屏幕高度高于1000，每页显示13行
    $(window).on('resize', function () {
        var $this = $(this);
        if ($this.height() < 600) {
            rowNum = 3;
            refreshPage();
        } else if ($this.height() > 1000) {
            rowNum = 15;
            refreshPage();
        } else {
            rowNum = 10;
            refreshPage();
        }
    });
    function init() {
        //初始化页面，并计算需要多少页
        $.get('data/test.json', function (data) {
            //计算行数去掉表头部分
            rows = data.length - 1;
            pages = Math.ceil(rows / rowNum);
            // console.log('pages',pages);
            //填充总行数，排除表头
            DOM.rows_total.html(rows);
            //填充总记录数,从一开始计算
            for (var j = 1; j < data.length; j++) {
                var item = data[j];
                for (var k = 0; k < item.length; k++) {
                    total++;
                }
            }
            DOM.data_total.html(total);
            //绘制表头
            drawThead(data[0]);
            $('.modal').modal();
            //绘制表体
            drawTbody(1);
            //绘制分页导航，给每个页码绑定点击事件
            drawPagination();
        });
    }

    function drawThead(thead) {
        var tr = $('<tr class="white-text"></tr>');
        for (var i = 0; i < thead.length; i++) {
            var $th = $('<th class="grey darken-2"><span>' + thead[i] + '</span></th>');
            var $dropDown = $('<a class="dropdown-button" href="#" data-activates="dropdown_th_' + i +
                '">' + thead[i] + '<i class="material-icons right">arrow_drop_down</i></a>');
            // console.log('th',th);
            $dropDown.hide();
            $th.css('cursor', 'pointer');
            // 每个表头项添加一个点击事件，触发后替换为一个下拉框
            $th.on('click', function (e) {
                //阻止事件冒泡
                e.stopPropagation();
                var $this = $(this);
                $this.find('span').hide();
                $this.find('.dropdown-button').show();
            });
            //鼠标离开表头时，替换完之前的表头
            $th.on('mouseleave', function () {
                // console.log('mouseleave');
                var $this = $(this);
                $this.find('.dropdown-button').hide();
                $this.find('span').show();
            });
            $th.append($dropDown);
            var $dropDownMenu = $(
                '<ul id="dropdown_th_' + i + '" class="dropdown-content">' +
                '<li><a href="#">删除列</a></li>' +
                (i % 2 === 0 ? '' : ('<li><a class="modal_btn" href=#modal' + i + ' data-index="' + i + '">离散化</a></li></ul>' +
                '<div id="modal' + i + '" class="modal">' +
                '<div class="row grey darken-2 white-text valign-wrapper modal-title"><h5 class="col s6">数据离散化(' + thead[i] + ')</h5>' +
                '<div class="col s6 valign"><i class="modal-action modal-close material-icons right">close</i></div></div>' +
                '<div class="modal-content">' +
                '<div class="col s12"><select class="browser-default"><option value="1">离散化方法</option><option value="2">其他</option></select></div>' +
                '<div class="row valign-wrapper"><div class="col s2 valign">分箱数：</div><div class="input-field col s7"><input data-boxindex="' + i + '" class="box_num" type="number" value="2"></div>' +
                '<a class="btn tooltipped col s2 offset-s1 center-align valign refresh" data-position="top" data-delay="50" data-tooltip="更新分箱数据"><i class="material-icons left">refresh</i>刷新</a></div>' +
                '<div id="bar' + i + '" class="bar"></div></div>' +
                '<div class="row grey darken-2 modal-footer"><a href="#" class="modal-action modal-close waves-effect waves-green col s6 center-align">确认</a>' +
                '<a href="#" class="modal-action modal-close waves-effect waves-red col s6 center-align">取消</a>' +
                '</div>' +
                '</div>'))
            );
            tr.append($th);
            $dropDownMenu.find('.modal_btn').on('click', function () {
                // console.log($(this),$(this).data('index'));
                $('#modal' + $(this).data('index')).modal('open');
                drawBox($(this).data('index'), 2);
            });
            $dropDownMenu.find('.refresh').on('click', function (e) {
                // e.stopPropagation();
                var box_num = $(this).parent().find('.box_num');
                drawBox(box_num.data('boxindex'), box_num.val());
            });
            $dropDownMenu.find('.modal-title').on('mousedown', function (e) {
                moveModal($(this).parent(), e);
            });
            DOM.body.append($dropDownMenu);
        }
        // console.log('tr',tr);
        DOM.thead.append(tr);
        $('table .dropdown-button').dropdown({
            hover: true,
            belowOrigin: true
        });
        //手动触发模态框
        // drawBox(3,2);
        // $('.modal').modal();
        // $('#modal3').modal('open');
    }

    function drawTbody(startRow) {
        $.get('data/test.json', function (data) {
            //先清空表体内容
            DOM.tbody.html('');
            var stop = Math.min((startRow + rowNum), data.length);
            for (var j = startRow; j < stop; j++) {
                var tb_tr = $('<tr></tr>');
                for (var k = 0; k < data[j].length; k++) {
                    var tb_td = $('<td>' + data[j][k] + '</td>');
                    tb_tr.append(tb_td);
                }
                DOM.tbody.append(tb_tr);
            }
            if ((stop - startRow) < rowNum) {
                // 绘制空格数部分
                var null_tr_num = rowNum - (stop - startRow);
                for (var i = 0; i < null_tr_num; i++) {
                    var null_tr = $('<tr></tr>');
                    for (var l = 0; l < 14; l++) {
                        var null_td = $('<td>' + '&nbsp' + '</td>');
                        null_tr.append(null_td);
                    }
                    DOM.tbody.append(null_tr);
                }
            }
        });
    }

    function drawPagination() {
        //清空分页导航条
        DOM.pagination.html('');
        var pagination_left = $('<li id="chevron_left"><a href="javascript:;"><i class="material-icons">chevron_left</i></a>');
        var pagination_right = $('<li id="chevron_right"><a href="javascript:;"><i class="material-icons">chevron_right</i></a>');
        //第一页和最后一页时，改变左右方向箭头样式
        if (currentPage === 1) {
            pagination_left.removeClass('waves-effect').addClass('disabled');
        }
        if (currentPage === pages) {
            pagination_right.removeClass('waves-effect').addClass('disabled');
        }
        //给左右方向箭头绑定事件，实现翻页
        pagination_left.on('click', function () {
            // console.log('currentPage',currentPage);
            if (currentPage === 1) return;
            currentPage = currentPage - 1;
            refreshPage();
        });
        pagination_right.on('click', function () {
            if (currentPage === pages) return;
            currentPage = currentPage + 1;
            refreshPage();
        });
        //绘制上一页的方向箭头
        DOM.pagination.append(pagination_left);
        var stopNum;
        //当前页面为页面导航条的第一页或者最后一页时，切换导航条
        if (currentPage <= startNum) {
            startNum = currentPage - 3 < 0 ? 1 : currentPage - 3;
        }
        stopNum = (startNum + 6) > pages ? pages : (startNum + 6);
        if (currentPage >= stopNum || currentPage === 6) {
            startNum = currentPage - 3;
            stopNum = startNum + 6;
        }
        //页面导航的第一页和最后一页增加一个...的指示
        if (startNum <= 1) {
            startNum = 1;
            stopNum = 6;
        } else if (stopNum >= pages) {
            startNum = pages - 5;
            stopNum = pages;
        }
        var more = $('<li><a href="javascript:;" style="cursor: text">...</a></li>');
        if (stopNum === pages) {
            DOM.pagination.append(more);
        }
        // 绘制页面导航的页码部分
        drawNum();
        if (startNum === 1) {
            DOM.pagination.append(more);
        }
        //绘制下一页的方向箭头
        DOM.pagination.append(pagination_right);
        //绘制页码函数
        function drawNum() {
            for (var i = startNum; i <= stopNum; i++) {
                var pagination_tpl = $('<li class="waves-effect" data-index="' + i +
                    '"><a href="javascript:;">' + (i < 10 ? ('0' + i) : i) +
                    '</a></li>');
                if (i === currentPage) {
                    pagination_tpl.addClass('active');
                }
                if (i < 1 || i > pages) continue;
                //绑定页码点击事件
                pagination_tpl.on('click', function () {
                    var $this = $(this);
                    currentPage = $this.data('index');
                    refreshPage();
                });
                DOM.pagination.append(pagination_tpl);
            }
        }
    }

    /*刷新页面的函数，计算初始行，然后重新绘制表格和页面导航条*/
    function refreshPage() {
        var newRow = ((currentPage - 1) * rowNum) || 1;
        drawTbody(newRow);
        drawPagination(currentPage, pages);
    }

    //绘制echarts 柱状图
    function drawBox(col_num, box_num) {
        var col_arr = [],
            new_col_arr = [],
            mark_x = [],
            min_x,
            max_x
            ;
        $.get('data/test.json', function (data) {
            var myEcharts = echarts.init(document.getElementById('bar' + col_num));
            var option;
            //计算col_arr中每一项在x中出现的次数,并离散化,生成连个新数组
            //new_col_arr为去除了重复项后的新的行数据和重复次数组成的二维数组
            discreArr(data);
            min_x = new_col_arr[0][0];
            max_x = new_col_arr[new_col_arr.length - 1][0];
            var mark_line = {
                animation: false,
                symbol: 'none',
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: 'black'
                    }
                },
                data: []
            };
            var mark_area = {
                silent: true,
                name: '值分布',
                data: []
            };
            //计算markLine的初始化坐标
            for (var p = 1; p < box_num; p++) {
                var mark_x_tpl = parseFloat(((max_x - min_x) * p / box_num + min_x).toFixed(2));
                mark_x.push(mark_x_tpl);
                mark_line.data.push({name: '分箱线', xAxis: mark_x_tpl});
            }
            //计算markArea的初始值
            for (var q = 0; q < box_num; q++) {
                var tmp = [{
                    name: (mark_x[q - 1] || min_x) + '到' + (mark_x[q] || max_x),
                    xAxis: (mark_x[q - 1] || min_x),
                    yAxis: 0
                }, {xAxis: (mark_x[q] || max_x), yAxis: 'max'}];
                if (q % 2 != 0) {
                    tmp[0].itemStyle = {
                        normal: {
                            color: '#ddd'
                        }
                    }
                }
                mark_area.data.push(tmp);
            }
            option = {
                title: {
                    // show: false,
                    // text: '直方图示例',         //标题
                    // subtext: 'echarts学习',    //副标题
                    // left: 100           //可以是数值，也可以是center,left,right
                    //            borderColor: 'red',
                    //            borderWidth: 5
                },
                toolbox: {
                    show: false,
                    itemSize: 20,
                    right: 100,
                    feature: {
                        dataView: {
                            show: true
                        },
                        /* restore: {
                         show: true
                         },*/
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        }
                    }
                },
                tooltip: {
                    trigger: 'item',  //item为数据项触发,xAxis为x轴触发
                    formatter: function (params) {
                        if (typeof params.value[0] === 'undefined') return;
                        return '数据：' + params.value[0] + '<br>' +
                            '样本数:' + params.value[1]
                    }
                },
                grid: {
                    left: 40,
                    right: 40
                },
                legend: {
                    data: ['离散化']
                },
                xAxis: {
                    name: '数据',
                    min: min_x,
                    max: max_x
                },
                yAxis: {
                    name: '样本数'
                },
                series: [
                    {
                        name: '离散化',
                        type: 'bar',
                        data: new_col_arr,
                        markLine: mark_line,
                        markArea: mark_area
                    }
                ]
            };
            myEcharts.setOption(option);
            //鼠标移动时markLine跟着一起移动
            //实现方法：鼠标距离浏览器左边界距离-图表距离左边距离，得到鼠标距离图表左边界距离
            //markLine的(x-min)/(max-min)=鼠标距离图表左边距/图表宽度
            myEcharts.on('mousedown', function (params) {
                var $this = $(this);
                //当点击的目标是markLine时做...
                if (params.componentType === 'markLine') {
                    //console.log('params.dataIndex',params.dataIndex);
                    var i = params.dataIndex;
                    var area_min = mark_x[i - 1] || min_x;
                    var area_max = mark_x[i + 1] || max_x;
                    //移动鼠标时，刷新图表markLine的位置
                    $(myEcharts.getDom()).on('mousemove', function (e) {
                        $this = $(this);
                        //console.log('mousemove');
                        var x_zuobiao = parseFloat(((e.clientX - $this.offset().left - 40) * (max_x - min_x) / ($this.width() - 80) + min_x).toFixed(2));
                        //console.log((e.clientX - $this.offset().left)*(max_x-min_x)/($this.width()));
                        //控制鼠标的移动范围，防止markArea重叠
                        if (x_zuobiao < area_min || x_zuobiao > area_max) {
                            return;
                        }
                        //计算标线的位置
                        option.series[0].markLine.data[i].xAxis = x_zuobiao;
                        //计算标线左侧区域
                        option.series[0].markArea.data[i][0].xAxis = area_min;
                        option.series[0].markArea.data[i][0].name = area_min + '到' + x_zuobiao;
                        option.series[0].markArea.data[i][1].xAxis = x_zuobiao;
                        //右侧
                        option.series[0].markArea.data[i + 1][0].xAxis = x_zuobiao;
                        option.series[0].markArea.data[i + 1][0].name = x_zuobiao + '到' + area_max;
                        option.series[0].markArea.data[i + 1][1].xAxis = area_max;
                        myEcharts.setOption(option);
                    });
                    //松开鼠标按键时，更新mark_x中记录的markLine横坐标
                    $(myEcharts.getDom()).on('mouseup', function (e) {
                        // console.log('mouseup');
                        mark_x[i] = parseFloat(((e.clientX - $this.offset().left - 40) * (max_x - min_x) / ($this.width() - 80) + min_x).toFixed(2));
                        myEcharts.setOption(option);
                        //解除事件绑定
                        $(this).unbind();
                        myAlert('当前分箱线值：' + mark_x[i]);
                    });
                    //鼠标移出图标时，操作同mouseup
                    $(myEcharts.getDom()).on('mouseout', function (e) {
                        // console.log('mouseout');
                        mark_x[i] = parseFloat(((e.clientX - $this.offset().left - 40) * (max_x - min_x) / ($this.width() - 80) + min_x).toFixed(2));
                        myEcharts.setOption(option);
                        $(this).unbind();
                        myAlert('当前分箱线值：' + mark_x[i]);
                    });
                }
            });
        });
        //数据处理
        function discreArr(data) {
            //取出所选列的数据
            for (var i = 1; i < data.length; i++) {
                var item = data[i][col_num];
                col_arr.push(item);
            }
            //对列数据从小到大排序
            col_arr.sort(sortNum);
            function sortNum(a, b) {
                return a - b;
            }

            //生成新的二维数组，一个是没有重复项的列数据，一个是重复次数
            var counter = 1;
            for (var j = 0; j < col_arr.length; j++) {
                if (col_arr[j] === col_arr[j + 1]) {
                    counter++;
                } else {
                    new_col_arr.push([col_arr[j], counter]);
                    counter = 1;
                }
                // console.log('new_col_arr.length,new_col_arr);
            }
        }
    }

    //移动模态框函数
    function moveModal(modal, event) {
        //获取按下鼠标时，鼠标距离面板左、上的距离
        disX = event.clientX - modal.offset().left;
        disY = event.clientY - modal.offset().top;
        // console.log('disX,disY',disX,disY);
        //移动鼠标
        DOM.document.on('mousemove', function (event) {
            var x = event.clientX - disX,
                y = event.clientY - disY,
                //获取视窗宽度
                winW = DOM.document.width(),
                winH = DOM.document.height(),
                maxW = winW - modal.width(),
                maxH = winH - modal.height();
            // console.log('winW,winH,maxW,maxH',winW,winH,maxW,maxH);
            //限制窗口移动范围
            if (x < 0) {
                x = 0;
            } else if (x > maxW - 10) {
                x = maxW - 10;
            }
            modal.css('margin', 0);
            modal.css('left', x + 'px');
            if (y < 10) {
                y = 10;
            } else if (y > maxH) {
                y = maxH;
            }
            modal.css('top', y + 'px');
            // console.log('x,y',x,y);
        });
        //释放鼠标
        DOM.document.on('mouseup', function () {
            DOM.document.unbind();
        });
    }

    //自定义alert
    function myAlert(title) {
        if (typeof title === 'string' && title !== 'undefined') {
            var $box
                , $box_mask
                , timer
                , $body = $('body')
                , $confirm
                ;
            $box = $('<div class="my-alert">' +
                '<h4 class="title">' + title + '</h4>' +
                '<a class="confirm btn">确认</a>' +
                '</div>')
                .css({
                    zIndex: 1000000
                });
            $box_mask = $('<div>' +
                '</div>')
                .css({
                    'background': 'rgba(0,0,0,.5)',
                    'position': 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 99999
                });
            $box_mask.on('click', hideAlert);
            $box.find('.cancel').on('click', hideAlert);
            $confirm = $box.find('.confirm');
            $confirm.on('click', hideAlert);
            $body.append($box_mask);
            $body.append($box);
            //焦点移动到确认按钮，这样按空格或者回车键也可以实现确认
            $confirm.focus();
            // replaceBox($box);
            function hideAlert() {
                $box.remove();
                $box_mask.remove();
            }

            function replaceBox(box) {
                var w = box.width() + parseInt(box.css('padding'))
                    , h = box.height() + parseInt(box.css('padding'))
                    ;
                box.css({
                    left: '50%',
                    'margin-left': -w / 2,
                    top: '50%',
                    'margin-top': (-h / 2) - 40
                });
            }
        }
    }
})();
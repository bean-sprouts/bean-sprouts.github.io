/**
 * Created by Minnie on 2017/1/3.
 */
;(function () {
    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return false;
    }
    var $form_add_task = $('#add_task')
        ,task_list = []
        ,$task_detail_mask = $('.task-detail-mask')
        // ,$task_detail = $('.task-detail')
        ,task_detail_mask
        ,$task_detail
        ,$task_item
        ,$item_delete
        ,$item_detail
        ,$item_complete
        ,$task_title
        ,$old_task_title
        ,$new_task_title
        ,$task_detail_delete
        ,$task_detail_hide
        ,$task_detail_complete
        ,isComplete
        ,timer
        ,$msg = $('.msg')
        ,$msg_content = $msg.find('.content')
        ,$msg_button = $msg.find('.msg-button')
        ,$alerter = $('#alerter')
        ;
    //页面初始化
    refreshPage();

    $msg_button.on('click',hideMsg);
    //首页提交按钮事件---新增任务
    $form_add_task.on('submit',function (e) {
        //禁用表单提交默认行为
        e.preventDefault();

        var new_task = {}
            ,$input = $('#new_task')
        ;

        //获取输入的值
        new_task.content = $input.val();
        new_task.complete = false;
        //不允许输入无效字符串
        if(!new_task.content){
            alert('请输入有效的内容！');
            return false;
        }
        //将输入的值保持到localstorage
        if (addTask(new_task)) {
            //将输入的值显示到页面中,并绑定相关的事件
            renderTaskItem(task_list.length-1);
            $input.val('');
        }
    });

    function refreshPage() {
        var i
            ,$task_list = $('#task_list')
            ;
        task_list = store.get('task_list') || [];
        $task_list.html('');
        for(i=0;i<task_list.length;i++) {
            renderTaskItem(i);
        }
        clearInterval(timer);
        taskCheck();
    }
    function taskCheck() {
        timer = setInterval(function () {
            var j
                ,current_timestamp = (new Date()).getTime();
            for(j=0;j<task_list.length;j++){
                var item = task_list[j]
                    ,task_timestamp
                    ;
                task_timestamp = new Date(item.date).getTime();
                if(current_timestamp-task_timestamp < 1){
                    updateTask(j,{informed:false});
                }
                if(!item || !item.date || item.informed) continue;
                if(current_timestamp-task_timestamp >= 1){
                    updateTask(j,{informed:true});
                    showMsg(item.content);
                }
            }
        },500);
        // clearInterval(timer);
    }

    //实现自定义confirm
    function myConfirm(title) {
        if (typeof title === 'string' && title !== 'undefined') {
            var dfd = $.Deferred()
                ,confirmed
                ,$box
                ,$box_mask
                ,timer
                ,$body = $('body')
                ,$confirm
                ;

            $box = $('<div class="my-confirm">' +
                '<div class="title">' + title + '</div>' +
                '<div class="button">' +
                '<button class="confirm">确认</button>' + '<button class="cancel">取消</button>' +
                '</div>' +
                '</div>')
                .css({
                    'background': '#fff',
                    'color': '#444',
                    'position': 'fixed',
                    'border-radius': 5,
                    padding: 10,
                    'text-align': 'center'
                });
            $box_mask = $('<div>' +
                '</div>')
                .css({
                    'background': 'rgba(0,0,0,.5)',
                    'position': 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

            $box_mask.on('click', function () {
                hideMyConfirm();
                confirmed = false;
            });
            $box.find('.cancel').on('click', function () {
                hideMyConfirm();
                confirmed = false;
            });
            $confirm = $box.find('.confirm');
            $confirm.on('click', function () {
                hideMyConfirm();
                confirmed = true;
            });

            //轮训检测用户点击了确认还是取消按钮
            timer = setInterval(function () {
                //confirmed默认为undefined
                if(confirmed !== undefined){
                    dfd.resolve(confirmed);
                    clearInterval(timer);
                }
            },100);

            $body.append($box_mask);
            $body.append($box);
            //焦点移动到确认按钮，这样按空格或者回车键也可以实现确认
            $confirm.focus();

            replaceBox($box);

            return dfd.promise();

            function hideMyConfirm() {
                $box.remove();
                $box_mask.remove();
            }
        }
    }
    function replaceBox(box) {
        var w = box.width()+parseInt(box.css('padding'))
            ,h = box.height()+parseInt(box.css('padding'))
            ;
        box.css({
            left: '50%',
            'margin-left': -w/2,
            top: '50%',
            'margin-top': (-h/2)-40
        });
    }
    function showMsg(msg) {
        if(!msg){
            return false;
        }
        $msg_content.html(msg);
        $msg.show();
        $alerter.get(0).play();
    }
    function hideMsg() {
        $msg.hide();
    }
    function refreshLocalstorage() {
        store.set('task_list',task_list);
    }

    function addTask(new_task) {
        //将输入的值保存到localstorage
        task_list.push(new_task);
        refreshLocalstorage();
        return true;
    }

    function renderTaskItem(index) {
        var $task_list = $('#task_list');
        var item = task_list[index];
        var task_item_tpl=$(
            '<div class="old-task-item">' +
            '<div class="task-item'+ (item.complete ? ' completed' : '') +'" data-index="' + index + '">' +
            '<span><input type="checkbox" ' + (item.complete ? 'checked' : '') + ' class="complete"></span>' +
            '<span class="task-content">'+ item.content +'</span>' +
            '<span class="float-right">' +
            '<span class="item-button item-delete">删除</span>' +
            '<span class="item-button item-detail">详情</span>' +
            '</span></div></div>');
        $task_item = task_item_tpl.find('.task-item');
        $item_delete = task_item_tpl.find('.item-delete');
        $item_detail = task_item_tpl.find('.item-detail');
        $item_complete = task_item_tpl.find('[type=checkbox]');
        listenTaskItem(index);
        item.complete ? $task_list.append(task_item_tpl) : $task_list.prepend(task_item_tpl);
    }
    function renderTaskDetail(item) {
        var index = item.data('index');
        var task = task_list[index];
        var $task_detail_tpl = $(
            '<form class="task-detail">' +
            '<div class="task-title">' +
            '<span><input type="checkbox" ' + (task.complete ? 'checked' : '') + ' class="complete"></span>' +
            '<span class="old-task-title">'+ task.content +'</span>' +
            '<input class="new-task-title" value="'+ task.content +'">' +
            '<span class="float-right">' +
            '<span class="item-button item-delete">删除</span>' +
            '<span class="item-button item-hide">收起</span>' +
            '</span>' +
            '</div>' +
            '<div class="task-desc"><!--任务描述开始-->' +
            '<p>详细内容</p>' +
            '<textarea name="task_desc">' + (task.desc || '') + '</textarea>' +
            '</div><!--任务描述结束-->' +
            '<div class="task-remind"><!--任务定时提醒开始-->' +
            '<p>提醒时间</p>' +
            '<input type="text" name="date" value="' + (task.date || '') + '">' +
            '</div>' +
            '<div><button type="submit">更新</button></div>' +
            '</form><!--任务定性提醒结束-->');
        $task_detail = $task_detail_tpl;
        $task_title = $task_detail_tpl.find('.task-title');
        $old_task_title = $task_detail_tpl.find('.old-task-title');
        $new_task_title = $task_detail_tpl.find('.new-task-title');
        $task_detail_hide = $task_detail_tpl.find('.item-hide');
        $task_detail_delete = $task_detail_tpl.find('.item-delete');
        $task_detail_complete = $task_detail_tpl.find('[type=checkbox]');
        $task_detail_tpl.find('[name=date]').datetimepicker();

        //任务详情相关事件
        listenTaskDetail(index);

        item.parent().append($task_detail_tpl);
        $task_detail_mask.show();
    }

    function listenTaskItem(index) {
        //删除任务按钮
        $item_delete.on('click',function () {
            myConfirm('确定要删除吗？')
                .then(function (r) {
                    if(r){
                        delItem(index);
                    }
                })
            ;
        });
        //任务详情按钮
        $item_detail.on('click',function (e) {
            //阻止事件冒泡
            e.stopPropagation();
            var $this = $(this);
            var $item = $this.parent().parent();
            $item.hide();
            //显示任务详情页面
            renderTaskDetail($item);
        });

        //双击任务显示任务详情
        $task_item.on('dblclick',function (e) {
            e.stopPropagation();
            var $this = $(this);
            $this.hide();
           renderTaskDetail($this);
        });
        //任务单选框事件---是否完成任务
        $item_complete.on('click',function (e) {
            e.stopPropagation();
            var $this = $(this);
            index = $this.parent().parent().data('index');
            isComplete = $this.is(':checked');
            isComplete ? updateTask(index,{complete:true}) : updateTask(index,{complete:false});
            refreshPage();
        });
    }
    function listenTaskDetail(index) {
        //更新任务详情
        $task_detail.on('submit',function (e) {
            e.preventDefault();
            var $this = $(this);
            var data = {};
            data.content = $new_task_title.val();
            data.desc = $this.find('[name=task_desc]').val();
            data.date = $this.find('[name=date]').val();
            updateTask(index,data);
            hideTaskDetail();
        });
        //双击任务标题替换为输入框
        $old_task_title.on('dblclick',function () {
            $(this).hide();
            $new_task_title.show();
            $new_task_title.focus();
            $new_task_title.select();
        });
        //任务标题输入框失焦则替换为标题
        $new_task_title.on('blur',function () {
            var $this = $(this);
            $this.hide();
            $old_task_title.html($this.val());
            $old_task_title.show();
        });
        //收起任务详情按钮
        $task_detail_hide.on('click',hideTaskDetail);
        //点击周围空白地方也收起任务详情
        $task_detail_mask.on('click',hideTaskDetail);
        //任务详情中的删除按钮
        $task_detail_delete.on('click',function () {
            myConfirm('确定要删除吗？')
                .then(function (r) {
                    if(r){
                        delItem(index);
                    }
                })
            ;
        });
        $task_detail_complete.on('click',function () {
            isComplete = $(this).is(':checked');
            isComplete ? updateTask(index,{complete:true}) : updateTask(index,{complete:false});
            refreshPage();
        });
    }

    // function showTaskDetail(index) {
    //     if(index === 'undefined' || !task_list[index]){
    //         return false;
    //     }
    //     //插入任务详情页内容
    //     renderTaskDetail(index);
    //     $task_detail_mask.show();
    //     $task_detail.show();
    // }

    function hideTaskDetail() {
        $task_detail.remove();
        $task_detail_mask.hide();
        refreshPage();
    }

    function updateTask(index,data) {
        if(index === 'undefined' || !task_list[index]){
            return;
        }
        task_list[index] = $.extend({},task_list[index],data);
        refreshLocalstorage();
        // refreshPage();
    }
    function delItem(index) {
        if(index === 'undefined' || !task_list[index]){
            return false;
        }
        //删除localstorage中的数据
        task_list.splice(index,1);
        refreshLocalstorage();
        refreshPage();
    }
}());
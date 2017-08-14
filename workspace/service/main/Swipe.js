/*
     这个文件是一个对外的接口，作用是实现画面的切换效果
 
     传入参数：container 页面切换内容的容器
 
 
 */

var Swipe_service_class = function (container) {
        var _this = this;
    
        //获得第一个子节点
        var element = container.find(":first");
        //获取li 的数量
    
        //var slides = element.find("li");//因为这个节点下面的li子节点还会有其他的li子节点,但是我只是需要父辈子节点。find会找到所有的子节点。
        var slides = element.find(">"); //这个地方相当于查找element节点的子元素
    
        //获取容器宽度
        var width = container.width();
        //高度
        var height = container.height();
        // 设置li页面总宽度(ul的总宽度)
        element.css({
                width: (slides.length * width)+  'px',
                height: height + 'px'
            });
    // 设置每一个页面li的宽度
    $.each(slides, function (index) {
            var slide = slides.eq(index); //获取到每一个li元素    
            slide.css({
                    width: width+  'px',
                    height: height + 'px'
                });
    });

    _this.scrollTo = function (x, speed) {
            var dtd = $.Deferred();
            //执行动画移动
            //element.css();
            element.transition(
                {
                        //'transition-timing-function': 'linear',
                        //'transition-duration': speed  'ms',
                        "transform": 'translate3d(-' + x + 'px,0px,0px)'
                    },
            speed,
            'linear',
            function () {
                    dtd.resolve(); // 动画完成  改变状态执行回调
                });
        //链式调用
        return dtd;
    }



} 
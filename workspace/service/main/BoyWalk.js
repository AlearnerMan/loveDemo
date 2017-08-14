function doorAction(left, right, time) {//这里是通过图片的移动来实现开关门的动作，
     var $door = $('.door');
     var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
     var defer = $.Deferred();
     var count = 2;//两扇门需要同时开启或者关闭 才会完成整个动作。
    // 等待开门完成
    var complete = function () {
         if (count == 1) {
            defer.resolve();  //说明有一扇们已经开启或者关闭，另一个执行了这个函数，defer的状态改变 说明已经完成了这个动作
             return;
         }
         count--;
     };
     doorLeft.transition({
         'left': left
     }, time, complete);
 
     doorRight.transition({
         'left': right
     }, time, complete);
 
     return defer;
 }
 
 // 开门
 function openDoor() {
     return doorAction('-50%', '100%', 2000);
 }
 
 // 关门
 function shutDoor() {
     return doorAction('0%', '50%', 2000);
 }
 
 //定义一个对象来存储灯亮和灯灭的过程
 var lamp = {
     elem: $('.b_background'),
     bright: function () {
         this.elem.addClass('lamp-bright')
     },
     dark: function () {
         this.elem.removeClass('lamp-bright')
     }
 };
 
 
 
 var instanceX;
 
 
 
 //处理小男孩的走路接口，只对外提供walkTo、stopWalk、setColoer三个接口
 
 var BoyWalk_Service_Class = function () {
     var _this = this;
     var container = $("#content");
     // 页面可视区域
     var visualWidth = container.width();
     var visualHeight = container.height();
 
     /*
        获取路的高度
    */
     var getValue = function (className) {
         var $elem = $("."+  className);
         //返回路的位置
         return {
             height: $elem.height(),
             top: $elem.position().top    //相对于最近的有定位父元素的高度
         };
     }
 
     // 桥的Y轴
     var bridgeY = function () {
         var data = getValue('c_background_middle');
         return data.top;
     }();
 
     ////////
     //小女孩 //
     ////////
     var girl = {
         elem: $('.girl'),
         getHeight: function () {
             return this.elem.height();
         },
         // 转身动作
         rotate: function () {
             this.elem.addClass('girl-rotate');//雪碧图，通过改变背景的位置，来实现小女孩转身动作
         },
         setOffset: function () {//设置小女孩的位置
             this.elem.css({
                 left: visualWidth / 2,
                 top: bridgeY - this.getHeight()
             });
         },
         getOffset: function () {  //获取小女孩的位置 ，用于设置小男孩的位置
             return this.elem.offset();
         },
         getWidth: function () {   //获取小女孩的宽度，用于设置小男孩需要走的距离
             return this.elem.width();
         }
     };
 
     // 修正小女孩位置
     girl.setOffset();
 
     ///////////
     //loge动画 //
     ///////////
     var logo = {
         elem: $('.logo'),
         run: function () {
             this.elem.addClass('logolightSpeedIn')
                 .on(animationEnd, function () {
                     $(this).addClass('logoshake').off();
                 });
         }
     };
     var snowflakeURl = [
        'http://img.mukewang.com/55adde120001d34e00410041.png',
        'http://img.mukewang.com/55adde2a0001a91d00410041.png',
        'http://img.mukewang.com/55adde5500013b2500400041.png',
        'http://img.mukewang.com/55adde62000161c100410041.png',
        'http://img.mukewang.com/55adde7f0001433000410041.png',
        'http://img.mukewang.com/55addee7000117b500400041.png'
     ]
 
     ///////
     //飘雪花 //
     ///////
     function snowflake() {
         // 雪花容器
         var $flakeContainer = $('#snowflake');
 
         // 随机六张图
         function getImagesName() {
             return snowflakeURl[[Math.floor(Math.random() * 6)]];
         }
         // 创建一个雪花元素
         function createSnowBox() {
             var url = getImagesName();
             return $('<div class="snowbox" />').css({
                 'width': 41,
                 'height': 41,
                 'position': 'absolute',
                 'backgroundSize': 'cover',
                 'zIndex': 100000,
                 'top': '-41px',
                 'backgroundImage': 'url(' + url+  ')'
             }).addClass('snowRoll');
         }
         // 开始飘花
         setInterval(function () {
             // 运动的轨迹
             var startPositionLeft = Math.random() * visualWidth - 100,
                 startOpacity = 1,
                 endPositionTop = visualHeight - 40,
                 endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                 duration = visualHeight * 10+  Math.random() * 5000;
 
             // 随机透明度，不小于0.5
             var randomStart = Math.random();
             randomStart = randomStart < 0.5 ? startOpacity : randomStart;
 
             // 创建一个雪花
             var $flake = createSnowBox();
 
             // 设计起点位置
             $flake.css({
                 left: startPositionLeft,
                 opacity: randomStart
             });
 
             // 加入到容器
             $flakeContainer.append($flake);
 
             // 开始执行动画
             $flake.transition({
                 top: endPositionTop,
                 left: endPositionLeft,
                 opacity: 0.7
             }, duration, 'ease-out', function () {
                 $(this).remove() //结束后删除
             });
 
         }, 200);
     }
 
     //获取小男孩应该走的路线的做标
 
     var pathY = function () {
         var data = getValue('a_background_middle');
         return data.top + data.height / 2;
     }
 
     var $boy = $("#boy");
     var boyWidth = $boy.width();
     var boyHeight = $boy.height();
     //修正小男孩的位置
     $boy.css({
         top: pathY - boyHeight
     });
 
 
     //暂停走路
     function pauseWalk() {
         $boy.addClass("pausewalk");  //暂停正在进行的动画 通过animation-play-state属性
     }
     //恢复走路
     function restoreWalk() {
         $boy.removeClass('pausewalk');
     }
     // css3的动作变化
     function slowWalk() {
         $boy.addClass('slowWalk');  //开始走路只是改变雪碧图的北京位置，让小男孩看起来像是走路，实际位置不会改变
     }
     //计算距离(包括X和Y两个方向)
     function calculateDist(direction, proportion) {
         return (direction == "x" ? visualWidth : visualHeight) * proportion;
     }
 
     //小男孩做的运动
     function stratRun(options, runTime) {
         var dfdPlay = $.Deferred();
         // 恢复走路
         restoreWalk();
         // 运动的属性
         $boy.transition(
             options,
             runTime,
             'linear',
             function () {
                 dfdPlay.resolve(); // 动画完成  改变状态执行回调
             });
         return dfdPlay;
     }
 
     // 开始走路
     function walkRun(time, dist, disY) {  //这个方法是小男孩开始走路，走到那个地方。
         time = time || 3000;
         // 脚动作
         slowWalk();
         // 开始走路
         var d1 = stratRun({
             'left': dist + 'px',
             'top': disY ? disY : undefined
         }, time);
         return d1;  //相当于返回一个promise对象
     }
 
     // 走进商店
     function walkToShop(runTime) {
         var defer = $.Deferred();//相当于创建一个promise对象
         var doorObj = $('.door');
         // 门的坐标
         var offsetDoor = doorObj.offset();
         var doorOffsetLeft = offsetDoor.left;
         var doorOffsetTop = offsetDoor.top;
         // 小孩当前的坐标
         var posBoy = $boy.position();
         var boyPoxLeft = posBoy.left;
         var boyPoxTop = posBoy.top;
 
         // 中间位置
         var boyMiddle = $boy.width() / 2;
         var doorMiddle = doorObj.width() / 2;
         var doorTopMiddle = doorObj.height() / 2;
 
 
         // 当前需要移动的坐标
         instanceX = doorOffsetLeft - (boyPoxLeft+  boyMiddle);
 
         // Y的坐标
         // top = 人物底部的top - 门中见的top值
         instanceY = boyPoxTop + boyHeight/2 - doorOffsetTop + (doorTopMiddle);
 
         // 开始走路
         var walkPlay = stratRun({
             transform: 'translateX(' + instanceX+  'px),translateY(-'+  instanceY+  'px),scale(0.3,0.3)',
             opacity: 0.1
         }, 2000);
         // 走路完毕
         walkPlay.done(function () {
             $boy.css({
                 opacity: 0
             });
             defer.resolve();
         });
         return defer;
 
     }
 
     // 走出店
     function walkOutShop(runTime) {
         var defer = $.Deferred();
         restoreWalk();
         // 开始走路
         var walkPlay = stratRun({
             transform: 'translateX(-' + instanceX + 'px),translateY(0px),scale(1,1)',
             opacity: 1
         }, runTime);
         // 走路完毕
         walkPlay.done(function () {
             defer.resolve();
         });
         return defer;
     }
     // 取花
     function talkFlower() {
         // 增加延时等待效果
         var defer = $.Deferred();
         setTimeout(function () {
             // 取花
             $boy.addClass('slowFlolerWalk');
             defer.resolve();
         }, 2000);
         return defer;
     }
 
 
 
     //提供对外的接口
     //walkTo
     _this.walkTo = function (time, proportionX, proportionY) {
         var distX = calculateDist('x', proportionX);
         var distY = calculateDist('y', proportionY);
         return walkRun(time, distX, distY);
     };
     // 走进商店
     _this.toShop = function () {
         return walkToShop.apply(null, arguments);
     };
     // 走出商店
      _this.outShop = function () {
          return walkOutShop.apply(null, arguments);
      };
 
 
     //停止走路
     _this.stopWalk = function () {
         pauseWalk();
     };
 
     // 取花
     _this.talkFlower =  function() {
         return talkFlower();
     };
 
     // 获取男孩的宽度
     _this.getWidth=  function() {
         return $boy.width();
     };
     // 复位初始状态
     _this.resetOriginal = function() {
         this.stopWalk();
         // 恢复图片
         $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
     };
     _this.setFlolerWalk=function(){
         $boy.addClass('slowFlolerWalk');
     };
 
     // 转身动作
     _this.rotate = function (callback) {
         restoreWalk();
         $boy.addClass('boy-rotate');
         // 监听转身完毕
     };
 
 } 
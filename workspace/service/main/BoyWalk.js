function doorAction(left, right, time) {//������ͨ��ͼƬ���ƶ���ʵ�ֿ����ŵĶ�����
     var $door = $('.door');
     var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
     var defer = $.Deferred();
     var count = 2;//��������Ҫͬʱ�������߹ر� �Ż��������������
    // �ȴ��������
    var complete = function () {
         if (count == 1) {
            defer.resolve();  //˵����һ�����Ѿ��������߹رգ���һ��ִ�������������defer��״̬�ı� ˵���Ѿ�������������
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
 
 // ����
 function openDoor() {
     return doorAction('-50%', '100%', 2000);
 }
 
 // ����
 function shutDoor() {
     return doorAction('0%', '50%', 2000);
 }
 
 //����һ���������洢�����͵���Ĺ���
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
 
 
 
 //����С�к�����·�ӿڣ�ֻ�����ṩwalkTo��stopWalk��setColoer�����ӿ�
 
 var BoyWalk_Service_Class = function () {
     var _this = this;
     var container = $("#content");
     // ҳ���������
     var visualWidth = container.width();
     var visualHeight = container.height();
 
     /*
        ��ȡ·�ĸ߶�
    */
     var getValue = function (className) {
         var $elem = $("."+  className);
         //����·��λ��
         return {
             height: $elem.height(),
             top: $elem.position().top    //�����������ж�λ��Ԫ�صĸ߶�
         };
     }
 
     // �ŵ�Y��
     var bridgeY = function () {
         var data = getValue('c_background_middle');
         return data.top;
     }();
 
     ////////
     //СŮ�� //
     ////////
     var girl = {
         elem: $('.girl'),
         getHeight: function () {
             return this.elem.height();
         },
         // ת����
         rotate: function () {
             this.elem.addClass('girl-rotate');//ѩ��ͼ��ͨ���ı䱳����λ�ã���ʵ��СŮ��ת����
         },
         setOffset: function () {//����СŮ����λ��
             this.elem.css({
                 left: visualWidth / 2,
                 top: bridgeY - this.getHeight()
             });
         },
         getOffset: function () {  //��ȡСŮ����λ�� ����������С�к���λ��
             return this.elem.offset();
         },
         getWidth: function () {   //��ȡСŮ���Ŀ�ȣ���������С�к���Ҫ�ߵľ���
             return this.elem.width();
         }
     };
 
     // ����СŮ��λ��
     girl.setOffset();
 
     ///////////
     //loge���� //
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
     //Ʈѩ�� //
     ///////
     function snowflake() {
         // ѩ������
         var $flakeContainer = $('#snowflake');
 
         // �������ͼ
         function getImagesName() {
             return snowflakeURl[[Math.floor(Math.random() * 6)]];
         }
         // ����һ��ѩ��Ԫ��
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
         // ��ʼƮ��
         setInterval(function () {
             // �˶��Ĺ켣
             var startPositionLeft = Math.random() * visualWidth - 100,
                 startOpacity = 1,
                 endPositionTop = visualHeight - 40,
                 endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                 duration = visualHeight * 10+  Math.random() * 5000;
 
             // ���͸���ȣ���С��0.5
             var randomStart = Math.random();
             randomStart = randomStart < 0.5 ? startOpacity : randomStart;
 
             // ����һ��ѩ��
             var $flake = createSnowBox();
 
             // ������λ��
             $flake.css({
                 left: startPositionLeft,
                 opacity: randomStart
             });
 
             // ���뵽����
             $flakeContainer.append($flake);
 
             // ��ʼִ�ж���
             $flake.transition({
                 top: endPositionTop,
                 left: endPositionLeft,
                 opacity: 0.7
             }, duration, 'ease-out', function () {
                 $(this).remove() //������ɾ��
             });
 
         }, 200);
     }
 
     //��ȡС�к�Ӧ���ߵ�·�ߵ�����
 
     var pathY = function () {
         var data = getValue('a_background_middle');
         return data.top + data.height / 2;
     }
 
     var $boy = $("#boy");
     var boyWidth = $boy.width();
     var boyHeight = $boy.height();
     //����С�к���λ��
     $boy.css({
         top: pathY - boyHeight
     });
 
 
     //��ͣ��·
     function pauseWalk() {
         $boy.addClass("pausewalk");  //��ͣ���ڽ��еĶ��� ͨ��animation-play-state����
     }
     //�ָ���·
     function restoreWalk() {
         $boy.removeClass('pausewalk');
     }
     // css3�Ķ����仯
     function slowWalk() {
         $boy.addClass('slowWalk');  //��ʼ��·ֻ�Ǹı�ѩ��ͼ�ı���λ�ã���С�к�������������·��ʵ��λ�ò���ı�
     }
     //�������(����X��Y��������)
     function calculateDist(direction, proportion) {
         return (direction == "x" ? visualWidth : visualHeight) * proportion;
     }
 
     //С�к������˶�
     function stratRun(options, runTime) {
         var dfdPlay = $.Deferred();
         // �ָ���·
         restoreWalk();
         // �˶�������
         $boy.transition(
             options,
             runTime,
             'linear',
             function () {
                 dfdPlay.resolve(); // �������  �ı�״ִ̬�лص�
             });
         return dfdPlay;
     }
 
     // ��ʼ��·
     function walkRun(time, dist, disY) {  //���������С�к���ʼ��·���ߵ��Ǹ��ط���
         time = time || 3000;
         // �Ŷ���
         slowWalk();
         // ��ʼ��·
         var d1 = stratRun({
             'left': dist + 'px',
             'top': disY ? disY : undefined
         }, time);
         return d1;  //�൱�ڷ���һ��promise����
     }
 
     // �߽��̵�
     function walkToShop(runTime) {
         var defer = $.Deferred();//�൱�ڴ���һ��promise����
         var doorObj = $('.door');
         // �ŵ�����
         var offsetDoor = doorObj.offset();
         var doorOffsetLeft = offsetDoor.left;
         var doorOffsetTop = offsetDoor.top;
         // С����ǰ������
         var posBoy = $boy.position();
         var boyPoxLeft = posBoy.left;
         var boyPoxTop = posBoy.top;
 
         // �м�λ��
         var boyMiddle = $boy.width() / 2;
         var doorMiddle = doorObj.width() / 2;
         var doorTopMiddle = doorObj.height() / 2;
 
 
         // ��ǰ��Ҫ�ƶ�������
         instanceX = doorOffsetLeft - (boyPoxLeft+  boyMiddle);
 
         // Y������
         // top = ����ײ���top - ���м���topֵ
         instanceY = boyPoxTop + boyHeight/2 - doorOffsetTop + (doorTopMiddle);
 
         // ��ʼ��·
         var walkPlay = stratRun({
             transform: 'translateX(' + instanceX+  'px),translateY(-'+  instanceY+  'px),scale(0.3,0.3)',
             opacity: 0.1
         }, 2000);
         // ��·���
         walkPlay.done(function () {
             $boy.css({
                 opacity: 0
             });
             defer.resolve();
         });
         return defer;
 
     }
 
     // �߳���
     function walkOutShop(runTime) {
         var defer = $.Deferred();
         restoreWalk();
         // ��ʼ��·
         var walkPlay = stratRun({
             transform: 'translateX(-' + instanceX + 'px),translateY(0px),scale(1,1)',
             opacity: 1
         }, runTime);
         // ��·���
         walkPlay.done(function () {
             defer.resolve();
         });
         return defer;
     }
     // ȡ��
     function talkFlower() {
         // ������ʱ�ȴ�Ч��
         var defer = $.Deferred();
         setTimeout(function () {
             // ȡ��
             $boy.addClass('slowFlolerWalk');
             defer.resolve();
         }, 2000);
         return defer;
     }
 
 
 
     //�ṩ����Ľӿ�
     //walkTo
     _this.walkTo = function (time, proportionX, proportionY) {
         var distX = calculateDist('x', proportionX);
         var distY = calculateDist('y', proportionY);
         return walkRun(time, distX, distY);
     };
     // �߽��̵�
     _this.toShop = function () {
         return walkToShop.apply(null, arguments);
     };
     // �߳��̵�
      _this.outShop = function () {
          return walkOutShop.apply(null, arguments);
      };
 
 
     //ֹͣ��·
     _this.stopWalk = function () {
         pauseWalk();
     };
 
     // ȡ��
     _this.talkFlower =  function() {
         return talkFlower();
     };
 
     // ��ȡ�к��Ŀ��
     _this.getWidth=  function() {
         return $boy.width();
     };
     // ��λ��ʼ״̬
     _this.resetOriginal = function() {
         this.stopWalk();
         // �ָ�ͼƬ
         $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
     };
     _this.setFlolerWalk=function(){
         $boy.addClass('slowFlolerWalk');
     };
 
     // ת����
     _this.rotate = function (callback) {
         restoreWalk();
         $boy.addClass('boy-rotate');
         // ����ת�����
     };
 
 } 
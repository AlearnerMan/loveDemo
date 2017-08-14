//主页的操作对象
var LoveDemo_service_class = function () {
    var _this = this;
    var container = $("#content");
    var visualWidth = container.width();
    var visualHeight = container.height();
    var $boy = $("#boy");
    var swipe = new Swipe_service_class(container);
    /*
   获取路的高度
*/
    var getValue = function (className) {
        var $elem = $("." + className);
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
    var boyWalk = new BoyWalk_Service_Class();
    // 页面滚动到指定的位置
    function scrollTo(time, proportionX) {
        var distX = container.width() * proportionX;
        swipe.scrollTo(distX, time);
    }
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
    /////////
    //右边飞鸟 //
    /////////
    var bird = {
        elem: $(".bird"),
        fly: function () {
            this.elem.addClass('birdFly')
            this.elem.transition({
                right: container.width()
            }, 15000, 'linear');
        }
    };

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
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll');
        }
        // 开始飘花
        setInterval(function () {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1,
                endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;

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


    //设置初始值
    function setDefault() {

        //云和太阳的动画
        $("#sun").addClass("rotation");
        $(".cloud1").addClass("cloud1Anim");
        $(".cloud2").addClass("cloud2Anim");

        // 开始第一次走路
        boyWalk.walkTo(3000, 0.5)
            .then(function () {//then会返回一个新的deffer对象，
                //暂停走路
                //boyWalk.stopWalk();
                //调用Swipe对象提供的画面移动的接口
                var x = $("#content").width();
                var speed = 5000;
                return swipe.scrollTo(x, speed);//这里需要返回一个deffer对象，这样下次then的时候就是在这个动画执行完成后的回调
            }).then(function () {
                //已经移动到了商店门口了，小男孩停止走动，商店开门
                boyWalk.stopWalk();

                return openDoor();
            })
            .then(function () {
                lamp.bright();
                boyWalk.toShop(2000);
            }).then(function () {
                // 取花
                return boyWalk.talkFlower();
            }).then(function () {
                // 飞鸟
                bird.fly();
            }).then(function () {
                //出商店
                return boyWalk.outShop(2000)
            }).then(function () {
                // 关门
                return shutDoor();
            }).then(function () {
                //灯暗
                lamp.dark();
                boyWalk.walkTo(3000, 0.1);
                var x = $("#content").width();
                var speed = 5000;
                return swipe.scrollTo(x * 2, speed);
            }).then(function () {
                //boyWalk.walkTo(2000,0.15);
                return boyWalk.walkTo(1500, 0.3, (bridgeY - girl.getHeight()) / visualHeight);
            }).then(function () {
                // 实际走路的比例
                var proportionX = (girl.getOffset().left - boyWalk.getWidth() + girl.getWidth() / 5) / visualWidth / 1.1;
                // 第三次桥上直走到小女孩面前
                return boyWalk.walkTo(1500, proportionX);
            }).then(function () {
                // 图片还原原地停止状态
                boyWalk.resetOriginal();
            }).then(function () {
                // 增加转身动作 
                setTimeout(function () {
                    girl.rotate();
                    boyWalk.rotate(function () {
                        // 开始logo动画
                        logo.run();
                    });
                    snowflake();
                }, 1000);
            });

    }
    _this.initPage = function () {
        //用来临时调整页面
        //swipe.scrollTo(visualWidth*2, 0);
        setTimeout(function () {
            setDefault();
        }, 200);
    };




}

new LoveDemo_service_class().initPage();
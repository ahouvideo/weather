//  以iphone6设计的html字体大小为100px为例子 

    window.onload = function(){
        function rem(){
            let baseScreen = 375;
            let baseSize = 100;

            //1.获取当前屏幕大小： innerHeight 或者 screen.width
            console.log('innerHeight=',innerWidth);
            let screenWidth = screen.width;
            console.log('screenWidth=',screenWidth);

            let fontSize = 0;
            //6.判断当屏幕宽度>1200 固定值pc端为200 .其他情况100
            if(screenWidth >= 1200){
                fontSize = 200;
            }else{
                fontSize = screenWidth / baseScreen *100;
            }
           
            //2.自动计算字体大小  let fontSize = screenWidth / baseScreen *100;

            // 3.获取 html 元素
            let html = document.getElementsByTagName('html')[0];
            console.log("html=",html);
            html.style.fontSize = fontSize + 'px';

        }
        //4.调用方法
        rem();

        //5.监听当屏幕窗口大小发生改变 调用自适应rem方法
            //性能问题，执行程序次数过多
        // this.onresize = function(){
        //     rem();
        // }
        let timers = [];
        window.onresize = function(){
            let timer = setTimeout(()=>{
                //去掉 其他定时器
                for(let i = 1; i<timers.length;i++){
                    clearTimeout(timers[i]);
                }
                timers =[];
                //只输出一次
                console.log('once')
                //最后执行
                rem();
                
            },500)

            timers.push(timer);
        }
    }

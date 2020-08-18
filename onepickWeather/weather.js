
$(function () {

    class Weather {
        //添加属性 通用
        constructor() {
            this.iconBase = 'iconfont icon-',
                this.iconses = {
                    qing: {
                        title: '晴',
                        icons: 'icon-qing'
                    },
                    yun: {
                        title: '云',
                        icons: 'icon-yun'
                    },
                    lei: {
                        title: '雷',
                        icons: 'icon-lei'
                    },
                    yin: {
                        title: '阴',
                        icons: 'icon-qing'
                    },
                    xue: {
                        title: '雪',
                        icons: 'icon-xue'
                    },
                    shachen: {
                        title: '沙尘',
                        icons: 'icon-shachen'
                    },
                    wu: {
                        title: '雾',
                        icons: 'icon-wux'
                    },
                    bingbao: {
                        title: '冰雹',
                        icons: 'icon-bingbao'
                    },
                    yu: {
                        title: '雨',
                        icons: 'icon-yu'
                    },



                }
        }

        //定位
        locationCity() {
            let self = this;
            //使用腾讯地图API获取城市定位
            $.ajax({
                type: 'get',
                data: {
                    //ip 可不填
                    key: 'ACTBZ-GTCRK-RPWJW-ACWO6-HHNZ5-57FE5',
                    output: 'jsonp'
                },
                url: 'https://apis.map.qq.com/ws/location/v1/ip',
                //响应数据类型
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function (data) {
                    console.log('data=', data);
                    //city内容 为data.result.ad_info.city
                    $('.city').text(data.result.ad_info.city);

                    // console.log('kkkk',data.result.ad_info.city.slice(0, -1))
                    //获取定位城市的实况天气
                    self.getcurrentWeather(data.result.ad_info.city);


                    //7天天气
                    self.weekWeather(data.result.ad_info.city)
                    //逐时天气
                    // self.weekWeatherHours(data.result.ad_info.city)

                }
            })
        }
        //调用
        //locationCity();

        //实况天气 
        getcurrentWeather(city) {
            $.ajax({
                // 请求参数 location ：city
                type: 'get',
                // url: baseUrl + 'now' +'?',
                url: "https://yiketianqi.com/api",

                data: {
                    appid: '38397969',
                    appsecret: '5qIUrfZT',
                    version: 'v6',
                    city: city.slice(0, -1),
                },
                success: function (data) {
                    console.log('实况data=', data);
                    //先定位 再获取 .获取当前温度

                    $('.weather-tem').text((data.tem) + '℃');
                    $('.status').html((data.wea) + '&nbsp;&nbsp;&nbsp;&nbsp;' + (data.tem2) + '~' + (data.tem1));

                    $('.tips').text(data.air_tips)

                    //根据 属性名 遍历获取 给wind在视图 设置 属性名遍历
                    let $divs = $('.windlist>div');
                    // console.log('divs=',$divs[0])
                    // console.log('class=',$('.wind')[0])
                    $divs.each((i, v) => { //i下标，v元素
                        //获取 data-name 和data-title

                        let dataName = $(v).data('name');
                        let dataTitle = $(v).data('title');

                        // console.log('dataName=', dataName)

                        // console.log('属性名内容=', $(v).find('.' + dataName))

                        //找到 data-name= wind_win.  属性data[属性名]
                        $(v).find('.' + dataName).text(data[dataName])
                        //console.log('data.visibility=',data.visibility)0,1,2

                        if (dataTitle) {
                            $(v).find('.' + dataTitle).text(data[dataTitle])
                        }


                    })


                }
            })
        }

        // 设置生成逐日天气 抽出数据 .然后在 week调用
        createDaily(weatherlist) {
            
            $('.weather-datas').empty();

            //设置宽度
            $('.weather-datas').css({
                width: weatherlist.length * 0.62 + 'rem'
            })
            //遍历生成
            weatherlist.forEach((v) => {
                console.log('vv=', v.index[0])
                let html = `
                    <div class="items">
                        <div>${v.date.split('-').slice(1).join('-')}</div>
                        <div>${v.wea}</div>
                        <div class='icon ${this.iconBase + v.wea_img}'></div>
                        <div >${v.tem2 + '~' + v.tem1}</div>
                    </div>
                    `

                $('.weather-datas').append(html);
                
                
            })
            //提示
            // let tips = v.index[0];
            
            $('.weatherTips').empty();
            let t = weatherlist[0].index[0];
            
            let tipses = `
            <h3>温馨提示</h3>
            <div class="hotStatus">
                <span>${t.title.slice(-4,100)}：</span>
                <span>${t.level}</span>
            </div>
            <div class="tipp">
                <span>${t.desc}</span>

            </div>
            `
            
            $('.weatherTips').append(tipses);
        }

        //7天天气 
        weekWeather(city) {
            let self = this;
            //判断是否有缓存数据
            let forecastWeather = JSON.parse(localStorage.getItem('forecastWeather'));
            //今天天气存在 根据时间date 就return  减少请求次数
            if (forecastWeather.daily.length > 0) {
                console.log('逐日天气已存在==');
                //获取当前日期   时间不一致getTime 
                let currentDate = new Date().toLocaleDateString().split('/');
                currentDate[1] = currentDate[1] > 9 ? currentDate[1] : '0' + currentDate[1];
                currentDate[2] = currentDate[2] > 9 ? currentDate[2] : '0' + currentDate[2];
                currentDate = currentDate.join('-');

                let currentWeatherDate = forecastWeather.daily[0].date;

                if (currentDate == currentWeatherDate) {
                    self.createDaily(forecastWeather.daily);
                    return;
                }
            }

            //时间不等就请求逐日数据
            $.ajax({
                type: 'GET',
                url: 'https://tianqiapi.com/api',
                data: {
                    version: 'v1',
                    appid: '38397969',
                    appsecret: '5qIUrfZT',
                    city: city.slice(0, -1),
                },
                success: function (res) {
                    console.log('7天res==', res);

                    // $('.tips').text(data.msg);
                    let weatherlist = res.data;
                    console.log('weatherlist=', weatherlist)

                    //先改数据再写入
                    //调用方法createDaily 数据存储
                    self.createDaily(weatherlist);
                    forecastWeather.daily = weatherlist;

                    localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));

                }
            })
        }

        // 创建逐时天气
        createHourly(weatherlistHours) {

            // console.log('weatherlistHours=', weatherlistHours)
            $('.weather-datas').empty();
            //设置宽度
            $('.weather-datas').css({
                width: weatherlistHours.length * 0.62 + 'rem'
            })
            //设置低温、最高温
            // $('tem').text(weatherlist.tem2+'~'+ weatherlist.tem1);

            //遍历生成
            weatherlistHours.forEach((v) => {
                // console.log('vv=', v)
                let html = `
            <div class="items">
                <div>${v.day.slice(3)}</div>
                <div>${v.wea}</div>
                <div class='wins'>${v.win}</div>
                <div >${v.tem}</div>
            </div>
            `
                $('.weather-datas').append(html)
            })

        }

        //处理时间
        getTime() {
            let date = new Date();
            let d = date.getDate();
            d = d >= 10 ? d : '0' + d;
            let h = date.getHours();
            h = h >= 10 ? h : '0' + h;
            return d + '日' + '08' + '时';
        }
        //逐小时
        weekWeatherHours(city) {
            let self = this;
            let forecastWeather = JSON.parse(localStorage.getItem('forecastWeather'));
            // console.log('currentHour==', currentHour);

            if (forecastWeather.hourly.length > 0) {
                console.log('逐时天气已存在==');
                //处理时间 日 时
                let currentHour = self.getTime();
                // console.log('currentHour==', currentHour);

                let currentWeatherHour = forecastWeather.hourly[0].day;
                // console.log('currentWeatherHour==', currentWeatherHour);

                if (currentHour == currentWeatherHour) {
                    self.createHourly(forecastWeather.hourly);
                    return;
                }

            }

            $.ajax({
                type: 'GET',
                url: 'https://tianqiapi.com/api',
                data: {
                    version: 'v1',
                    appid: '38397969',
                    appsecret: '5qIUrfZT',
                    city: city.slice(0, -1),
                },
                success: function (res) {
                    console.log('逐小时res==', res);
                    // $('.tips').text(data.msg);

                    let weatherlistHours = res.data[0].hours;
                    console.log('weatherlistHours=', weatherlistHours)

                    self.createHourly(weatherlistHours);
                    forecastWeather.hourly = weatherlistHours;

                    localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));


                }
            })
        }

        

        //搜索数据
        searchValue() {
            let city = $('.search-input').val();
            console.log('citysss==', city)
            // 输入框 为空
            if (city.trim() == '' ) {
                alert('暂无此城市天气');
                return;
            }
            //处理 结尾是否含 市
            if (!city.endsWith('市')) {
                city = city + '市'
            }
            //处理 查找不到的城市
            

            //清除缓存 置空即可
            let forecastWeather = {
                daily: [],
                hourly: []
            }
            localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));

            $('.city').text(city);
            //再次输入 置空 默认为 逐日天气
            $('.search-input').val();

            //获取当前天气
            weather.getcurrentWeather(city);
            //获取逐日天气
            weather.weekWeather(city);
        }

        //初始化方法
        init() {
            //不存在才 初始化缓存逐日, 逐小时
            if (!localStorage.getItem('forecastWeather')) {
                let forecastWeather = {
                    daily: [],
                    hourly: []
                }
                localStorage.setItem('forecastWeather', JSON.stringify(forecastWeather));
            }

            this.locationCity();
        }
    }

    let weather = new Weather();
    weather.init();
    //点击切换标签 拿到宽度=  index*宽度 = 移动left
    //关联属性名   。动态调用方法.封装方法class
    let dp = 'weekWeather';
    $('.day>div').on('click', function () {

        let dataProperty = $(this).data('fn');
        console.log('$(this)', $(this));


        if (dp == dataProperty) {
            console.log('拦截')
            return;
        }
        dp = dataProperty;
        console.log('dp=', dp);

        let index = $(this).index();
        let width = $(this).width();

        let htmlFontSize = parseFloat($('html').css('fontSize'));
        let widthRem = width / htmlFontSize;

        $('.moveLine').animate({
            left: index * widthRem + .1 + 'rem'
        }, 250);

        let city = $('.city').text()
        //调用
        weather[dataProperty](city);

    })



    //切换城市 点击
    $('.search-icon').on('click', function () {
        weather.searchValue()
    })
    //回车 切换
    $('.search-input').on('keyup', function (e) {
        if (e.keyCode == '13') {
            weather.searchValue()
        }
    })
})
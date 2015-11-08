/**
 * storage.js
 * 轻量级的前端数据存储组件（支持localStorage|userData|cookie）
 * https://github.com/tjuking/storage
 */

(function (global, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(function () {
            return factory(global);
        });
    } else if (typeof exports !== "undefined") {
        module.exports = factory(global);
    } else {
        global.Storage = factory(global);
    }

})(window, function (window) {
    "use strict";

    var expiresPrefix = "_t_"; //localStorage、userData存储缓存时间key的前缀
    var userData = document.documentElement; //userData对象
    var userDataName = "userData"; //userData可以有多个文件，目前只在一个文件上操作

    //相关兼容性检测的结果
    var localStorageSupport = checkLocalStorage();
    var userDataSupport = checkUserData();
    var jsonSupport = checkJSON();

    //如果需要支持userData则进行初始化
    if (!localStorageSupport && userDataSupport) {
        userData.addBehavior("#default#userData");
        userData.load("userData");
    }

    //封装的存储对象
    var _S = {

        /**
         * 设置数据（localStorage、userData）
         * @param name 存储的键
         * @param value 存储的值
         * @param expires 过期时间间隔（单位是毫秒），默认是始终有效
         * @returns {boolean} true表示存储成功，false表示存储失败
         *
         * 补充说明：
         * 1. 可以同时存储一组数据，此时name为一个json对象，value则为过期时间间隔（此时的函数返回值会不准确）
         * 2. value可以为一个json对象，不过需要在支持JSON解析的浏览器中，否则无法存储
         */
        setItem: function (name, value, expires) {
            //如果没有设置内容则视为无效设置，退出
            if (!name) {
                return false;
            }

            //设置一组数据的存储
            if (typeof name === "object") {
                expires = value;

                //循环调用单个数据的存储
                for (var key in name) {
                    if (name.hasOwnProperty(key)) {
                        _S.setItem(key, name[key], expires);
                    }
                }

            //设置单个数据的存储
            }else{
                //设置的值如果没有定义，则退出
                if (typeof value === "undefined") {
                    return false;
                //设置json对象时
                } else if (typeof value === "object") {
                    //JSON对象需要转化成字符串
                    if (jsonSupport) {
                        value = JSON.stringify(value);
                    } else {
                        return false;
                    }
                }

                //过期时间的处理，ms为单位
                if (expires) {
                    expires = +new Date() + expires;
                }

                //优先进行localStorage的存储
                if (localStorageSupport) {
                    localStorage.setItem(name, value);
                    //如果存在过期时间，则需要设置
                    expires && localStorage.setItem(expiresPrefix + name, expires);
                //其次是userData的存储
                } else if (userDataSupport) {
                    userData.setAttribute(name, value);
                    expires && userData.setAttribute(expiresPrefix + name, expires);
                    //更改userData后需要保存
                    userData.save(userDataName);
                } else {
                    return false;
                }
            }
            return true;
        },

        /**
         * 获取数据 （localStorage、userData）
         * @param name 获取存储的key
         * @returns {*} 获取失败会返回false；如果之前存储的是json对象，会将其转化后返回（需要浏览器支持JSON解析）
         */
        getItem: function (name) {
            var value; //返回值
            var expires; //过期时间
            var jsonValue; //value解析成json后的值
            var now = +new Date(); //当前时间

            //如果key为空则视为无效获取，退出
            if (!name) {
                return false;
            }

            //优先进行localStorage的存储获取
            if (localStorageSupport) {
                value = localStorage.getItem(name);
                expires = localStorage.getItem(expiresPrefix + name);
            //其次是userData
            } else if (userDataSupport) {
                value = userData.getAttribute(name);
                expires = userData.getAttribute(expiresPrefix + name);
            }

            //数据过期时的处理
            if (expires && +expires <= now) {
                _S.removeItem(name);
                return false;
            } else {
                try {
                    if (jsonSupport) {
                        jsonValue = JSON.parse(value);
                        //对于解析成功的json对象，需要还原
                        if (typeof jsonValue == "object") {
                            value = jsonValue;
                        }
                    }
                    return value
                } catch (e) {
                    return value;
                }
            }
        },

        /**
         * 删除数据 （localStorage、userData）
         * @param name 删除存储的key
         * @returns {boolean} true表示删除动作成功，false表示未进行删除动作
         */
        removeItem: function (name) {
            //如果key为空则视为无效删除，退出
            if (!name) {
                return false;
            }

            //优先进行localStorage的删除
            if (localStorageSupport) {
                localStorage.removeItem(name);
                localStorage.removeItem(expiresPrefix + name);
            //其次是userData
            } else if (userData) {
                userData.removeAttribute(name);
                userData.removeAttribute(expiresPrefix + name);
                //删除userData后需要保存
                userData.save(userDataName);
            } else {
                return false;
            }
            return true;
        },

        /**
         * 设置cookie
         * @param name 设置的cookie名称
         * @param value 设置的cookie值
         * @param options cookie设置时的其它选项（非必填），例如：expires、domain、path、secure
         * @returns {boolean} true表示设置成功，false表示设置失败
         */
        setCookie: function (name, value, options) {
            var expiresDate = new Date(); //过期时间，默认是session
            var cookieItem = ""; //最终设置的cookie字符串

            //如果不是有效的存储就退出
            if(!name || typeof value === "undefined"){
                return false;
            }

            //可以一次存储多个值
            if(typeof name === "object"){
                options = value;
                //循环调用单个cookie的存储
                for(var key in name){
                    if(name.hasOwnProperty(key)){
                        _S.setCookie(key, name[key], options);
                    }
                }
            }else{
                options = options || {};
                //name和value需要转义
                cookieItem += encodeURIComponent(name) + "=" + encodeURIComponent(value);

                //分别对各个选项进行处理
                if(options.domain){
                    cookieItem += "; domain=" + options.domain;
                }
                if(options.path){
                    cookieItem += "; path=" + options.path;
                }
                if(options.expires){
                    expiresDate.setTime(expiresDate.getTime() + options.expires);
                    cookieItem += "; expires=" + expiresDate.toUTCString();
                }
                if(options.secure){
                    cookieItem += "; secure";
                }
                document.cookie = cookieItem;
            }
            return true;
        },

        /**
         * 获取cookie
         * @param name 获取的cookie名称
         * @returns {*} 获取成功则返回相应的内容，否则返回false
         */
        getCookie: function (name) {
            var cookies = document.cookie; //存储的cookie
            var key; //cookie的key
            var keyValue; //单个cookie的key-value数组

            //无效获取，则退出
            if(!name){
                return false;
            }

            //将cookie分割成数组
            cookies = cookies ? cookies.split(";") : [];
            //遍历匹配
            for(var i=0; i<cookies.length; i++){
                //获取单个cookie的key-value数组
                keyValue = cookies[i].split("=");
                //去除空白符
                key = keyValue[0].replace(/^\s+/, "");
                //匹配名称
                if(decodeURIComponent(key) === name){
                    return decodeURIComponent(keyValue[1]);
                }
            }
            return false;
        },

        /**
         * 删除cookie
         * @param name 删除的cookie的名称
         * @returns {boolean} 删除动作成功返回true，未进行删除动作则返回false
         */
        removeCookie: function (name) {
            //无效删除，则退出
            if(!name){
                return false;
            }

            //设置失效时间即为删除
            return _S.setCookie(name, "", {
                expires: -1
            });
        },

        //特性检测结果
        support: {
            localStorage: localStorageSupport, //localStorage支持性
            userData: userDataSupport, //userData支持性
            JSON: jsonSupport //JSON支持性
        }

    };

    //检测是否支持localStorage
    function checkLocalStorage() {
        try {
            localStorage.setItem("_localStorageSupport", "1");
            localStorage.removeItem("_localStorageSupport");
            return true;
        } catch (e) {
            return false;
        }
    }

    //检测是否支持userData
    function checkUserData() {
        if (!userData || !userData.addBehavior) {
            return false;
        }
        try {
            userData.addBehavior("#default#userData");
            userData.load("userData");
            userData.setAttribute("_userDataSupport", "1");
            userData.save("userData");
            return userData.getAttribute("_userDataSupport") == "1";
        } catch (e) {
            return false;
        }
    }

    //检测是否支持JSON
    function checkJSON() {
        return window.JSON && JSON.stringify && JSON.parse;
    }

    return _S;
});
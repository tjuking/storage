# storage

轻量级的前端数据存储组件，支持localStorage、cookie、userData。


### 特点

* 结合localStorage和userData，提供兼容更多浏览器的本地存储方案
* 能够为本地存储数据设置过期时间
* 提供cookie的相关接口
* 能够批量存储数据
* 在支持JSON的浏览器，可直接进行JSON数据的存储和读取
* 使用安全，不会因为不支持的情况导致报错

### 接口

操作成功返回`true`，没操作或操作不成功则返回`false`

#### localStorage和userData

存储接口 - `setItem(name, value, expires)`

* 参数`name`表示存储数据的key
* 参数`value`表示存储数据的值
* 参数`expires`表示存储数据的过期时间间隔（单位是毫秒），可以不设置，默认是始终存储
* 可以同时存储一组数据，此时参数`name`为一个json对象，参数`value`则为过期时间间隔
* 参数`value`可以为一个json对象，不过需要浏览器支持JSON的解析


读取接口 - `getItem(name)`

* 参数`name`表示读取数据的key

删除接口 - `removeItem(name)`

* 参数`name`表示删除数据的key

#### cookie

存储接口 - `setCookie(name, value, options)`

* 参数`name`表示存储cookie的名称
* 参数`value`表示存储cookie的值
* 参数`option`可设置其它选项（非必填），例如：expires、domain、path、secure
* 可以同时存储一组数据，此时的`name`为一个json对象，参数`value`为设置cookie的其它选项

读取接口 - `getCookie(name)`

* 参数`name`表示读取cookie的名称

删除接口 - `removeCookie(name)`

* 参数`name`表示删除cookie的名称

### 示例

#### localStorage和userData

```js

//设置单个数据
Storage.setItem("name-1", "value-1");

//设置过期时间
Storage.setItem("name-2", "value-2", 24*60*60*1000);

//设置json格式数据
Storage.setItem("name-3", {
    "a": "value-3",
    "b": "value-3"
});

//设置一组数据
Storage.setItem({
    "name-4": "value-4",
    "name-5": {
        "a": "value-5",
        "b": "value-5"
    }
});

//获取数据
Storage.getItem("name-1");

//删除数据
Storage.removeItem("name-2");

```

#### cookie

```js

//设置单个cookie
Storage.setCookie("name-1", "value-1");

//设置选项
Storage.setCookie("name-2", "value-2", {
    "expires": 30*24*60*60*1000,
    "domain": "*.example.com",
    "path": "/",
    "secure": true
});

//设置一组cookie
Storage.setCookie({
    "name-3": "value-3",
    "name-4": "value-4"
}, {
    "expires": 24*60*60*1000
});

//获取cookie
Storage.getCookie("name-1");

//删除cookie
Storage.removeCookie("name-2");


```

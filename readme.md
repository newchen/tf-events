## JS 自定义事件

```javascript
// 引入
import Events from "tf-events";

// 监听
Events.on("aclick", function (a, b) {
    console.log(a, b);
});

// 触发
Events.emit("aclick", "a", "b");

// 注销
Events.off("aclick");
// 触发
Events.emit("aclick", "a", "b");

// 只能注册一次
Events.one("oneClick", function (a, b) {
    console.log('one1', a, b);
});
Events.one("oneClick", function (a, b) {
    console.log('one2', a, b);
});
Events.emit("oneClick", "aa", "bb");
Events.emit("oneClick", "aaa", "bbb");

// 能同时注册多次, 但是执行一次后失效
Events.once("onceClick", function (a, b) {
    console.log('once1', a, b);
});
Events.once("onceClick", function (a, b) {
    console.log('once2', a, b);
});
Events.emit("onceClick", "aa", "bb");
Events.emit("onceClick", "aaa", "bbb");

// 先触发再注册
// Events.on("emit-then-on", function (a, b) {
//     console.log('emit-then-on: 111', a, b);
// });

Events.emit("emit-then-on", 1, 2);

Events.on("emit-then-on", function (a, b) {
    console.log('emit-then-on: 222', a, b);
});
Events.on("emit-then-on", function (a, b) {
    console.log('emit-then-on: 333', a, b);
});

setTimeout(() => {
    Events.emit("emit-then-on", 3, 4);

    setTimeout(() => {
        Events.emit("emit-then-on", {a: 'aaa'});
    }, 1000)
}, 2000)
```


## 更新日志

```
1.0.7:
    添加先触发再注册功能

2.0.0:
    改写内部代码, once行为和1.x版本不一样了, 添加了one方法
    once: 能同时注册多次, 但是执行一次后失效
    one: 只能注册一次, 如果多次, 只有第一次的有效
    on, one, once都支持先触发再注册功能

    todo:
        all方法支持: 可以订阅多个事件, 事件全部触发后再触发回调
```

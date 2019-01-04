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

// 执行一次后自动注销
Events.once("onceClick", function (a, b) {
    console.log('111', a, b);
});
Events.once("onceClick", function (a, b) {
    console.log('222', a, b);
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
```

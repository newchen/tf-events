// 自定义事件, 使用ES5语法编写
var notIncludes = function (arr, fn) {
    return arr.every(function(v) {
        return v !== fn; 
    })
}

export default {
    _events: {}, // 事件
    _onceCache: {}, // 能同时注册多次, 但是执行一次后失效
    _oneCache: {}, // 只能注册一次, 如果多次, 只有第一次的有效
    _emitCache: {}, // 先触发, 再监听
    /*
    _allCache: { already: {}, wait: {} }, // 已经触发过的事件

    // 可以订阅多个事件, 事件全部触发后再触发该回调, 类似Promise.all
    all: function (names, callback) {
        if(typeof names === 'string') {
            names = names.split(',')
        }

        this._allCache.wait = [names, callback];

        callback(args);

        return this;
    },*/

    // 触发自定义事件
    emit: function (name) {
        var args = [].slice.call(arguments, 1);
        // 存储触发事件的参数, 用于先触发, 再监听的情况
        this._emitCache[name] = args;

        // 存储触发过的事件
        // this._allCache.already[name] = true;

        if (!this._events[name]) {
            return this;
        }

        var i = 0,
            l = this._events[name].length;

        if (!l) {
            return this;
        }

        var events = [],
            onceEvents = this._onceCache[name] || [];
        
        for (; i < l; i++) {
            var fn = this._events[name][i];
            fn.apply(this, args);

            // fn不在onceEvents里面
            if (notIncludes(onceEvents, fn)) {
                events.push(fn)
            }
        }

        // 执行过了, 置空
        this._onceCache[name] = null;

        // 重置, 删除使用once注册的
        this._events[name] = events; 

        return this;
    },

    // 删除自定义事件
    off: function (name, callback) {
        if (!(name || callback)) {
            this._events = {};
            this._oneCache = {};
            this._onceCache = {};
            this._emitCache = {};
            return this;
        }

        var list = this._events[name];
        if (list) {
            if (callback) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i] === callback) {
                        list.splice(i, 1);
                    }
                }
            } else {
                this._events[name] = null;
                this._oneCache[name] = null;
                this._onceCache[name] = null;
                this._emitCache[name] = null;
            }
        }

        return this;
    },

    // 添加自定义事件
    on: function (name, fn) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        // once的情况
        if (arguments[2] !== true) {
            this._events[name].push(fn);
        }

        //先触发, 再监听的情况
        if (this._emitCache[name]) {
            fn.apply(null, this._emitCache[name]);
            // this._onceCache[name] = null;
        }

        return this;
    },

    // 只能注册一次, 如果多次, 只有第一次的有效
    one: function (name, fn) {
        var onceNameExist = this._oneCache[name];

        if (onceNameExist) {
            console.log(name + '事件只有第一次注册的有效')
            return this;
        }

        this.on(name, fn);
        this._oneCache[name] = fn;

        return this;
    },

    // 能同时注册多次, 但是执行一次后失效
    once: function (name, fn) {
        if (!this._onceCache[name]) {
            this._onceCache[name] = [];
        }

        this._onceCache[name].push(fn)
        this.on(name, fn, this._emitCache[name] ? true : false);
        
        return this;
    }
};

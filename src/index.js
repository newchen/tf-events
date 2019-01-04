// 自定义事件
export default {
    _events: {}, // 事件
    _onceEvents: {}, // 一次性事件
    _emitThenOn: {}, // 先触发, 再监听

    /*// 可以订阅多个事件, 事件全部触发后再触发该回调, 类似Promise.all
    all: function (names) {
        let args = [].slice.call(arguments, 1, -1)
        let callback = [].slice.call(arguments, -1)[0];

        if (args[0] === callback) {
            if (typeof callback === 'function') {
                args = []
            } else {
                callback = function() {}
            }
        }

        if(typeof names === 'string') {
            names = names.split(',')
        }

        names.forEach(function(v) {
            this.emit.apply(this, v, args)
        })

        callback(args);

        return this;
    },*/

    // 触发自定义事件
    emit: function (name) {
        if (!this._events[name]) {
            return this;
        }

        var i = 0,
            l = this._events[name].length,
            args = [].slice.call(arguments, 1);

        if (!l) {
            return this;
        }

        for (; i < l; i++) {
            this._events[name][i].apply(this, args);
        }

        if (this._onceEvents[name]) {
            this._events[name] = null;
            this._onceEvents[name] = null;
            delete this._events[name];
            delete this._onceEvents[name];
        }

        this._emitThenOn[name] = args;

        return this;
    },

    // 删除自定义事件
    off: function (name, callback) {
        if (!(name || callback)) {
            this._events = {};
            this._onceEvents = {};
            this._emitThenOn = {};
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
                this._onceEvents[name] = null;
                this._emitThenOn[name] = null;
                delete this._events[name];
                delete this._onceEvents[name];
                delete this._emitThenOn[name];
            }
        }

        return this;
    },

    // 添加自定义事件
    on: function (name, fn) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(fn);

        //说明有缓存 可以执行
        if (this._emitThenOn[name]) {
            fn.apply(null, this._emitThenOn[name]);
        }

        return this;
    },

    // 只执行一次的事件
    once: function (name, fn) {
        let onceNameExist = this._onceEvents[name];

        if (this._events[name] && !onceNameExist) {
            console.warn('你可能用on注册过该事件，不应该再用once注册，请换个名称');
        }

        if (onceNameExist) return;

        this.on(name, fn);
        this._onceEvents[name] = fn;

        return this;
    }
};

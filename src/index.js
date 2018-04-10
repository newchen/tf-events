// 自定义事件
// todo: 添加可以先触发再监听功能

export default {
    _events: {},
    _onceEvents: {},

    // todo: 可以订阅多个事件, 事件全部全部触发后再触发该回调, 类似Promise.all
    all: function (names, callback) {

    },

    // 触发自定义事件
    emit: function (name) {
        if (!this._events[name]) {
            return this;
        }

        var i = 0,
            l = this._events[name].length;

        if (!l) {
            return this;
        }

        for (; i < l; i++) {
            this._events[name][i].apply(this, [].slice.call(arguments, 1));
        }

        if (this._onceEvents[name]) {
            delete this._events[name];
            delete this._onceEvents[name];
        }

        return this;
    },

    // 删除自定义事件
    off: function (name, callback) {
        if (!(name || callback)) {
            this._events = {};
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
                delete this._events[name];
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
        this._onceEvents[name] = true;

        return this;
    }
};
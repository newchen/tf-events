(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Events"] = factory();
	else
		root["Events"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// 自定义事件
exports.default = {
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
    emit: function emit(name) {
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
    off: function off(name, callback) {
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
    on: function on(name, fn) {
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
    once: function once(name, fn) {
        var onceNameExist = this._onceEvents[name];

        if (this._events[name] && !onceNameExist) {
            console.warn('你可能用on注册过该事件，不应该再用once注册，请换个名称');
        }

        if (onceNameExist) return;

        this.on(name, fn);
        this._onceEvents[name] = fn;

        return this;
    }
};

/***/ })
/******/ ]);
});
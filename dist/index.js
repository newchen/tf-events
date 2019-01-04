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
// 自定义事件, 使用ES5语法编写
var notIncludes = function notIncludes(arr, fn) {
    return arr.every(function (v) {
        return v !== fn;
    });
};

exports.default = {
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
    emit: function emit(name) {
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
                events.push(fn);
            }
        }

        // 执行过了, 置空
        this._onceCache[name] = null;

        // 重置, 删除使用once注册的
        this._events[name] = events;

        return this;
    },

    // 删除自定义事件
    off: function off(name, callback) {
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
    on: function on(name, fn) {
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
    one: function one(name, fn) {
        var onceNameExist = this._oneCache[name];

        if (onceNameExist) {
            console.log(name + '事件只有第一次注册的有效');
            return this;
        }

        this.on(name, fn);
        this._oneCache[name] = fn;

        return this;
    },

    // 能同时注册多次, 但是执行一次后失效
    once: function once(name, fn) {
        if (!this._onceCache[name]) {
            this._onceCache[name] = [];
        }

        this._onceCache[name].push(fn);
        this.on(name, fn, this._emitCache[name] ? true : false);

        return this;
    }
};

/***/ })
/******/ ]);
});
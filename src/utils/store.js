/*
 * @Author: 2ue
 * @Date: 2017-3-18 13:02:55
 * @Last Modified by: 2ue
 * @Last Modified time: 2017-12-19 10:03:51
 * @descrition: 对localstorage的一些简单封装
 * @ps: 未对不支持localstorage的浏览器做兼容处理
 */
/*eslint-disable*/
(function (root) {
    var _store = root.localStorage || localStorage;
    // 检测是否支持localstorage
    if (!_store) {
        console.log('不支持localStorage');
        return;
    };
    var _util = {
        getType: function (para) {
            var type = typeof para;
            if (type === "number" && isNaN(para)) return "NaN";
            if (type !== "object") return type;
            return Object.prototype.toString
                .call(para)
                .replace(/[\[\]]/g, "")
                .split(" ")[1]
                .toLowerCase();
        },
        map: function (para, fn) {
            var paraType = _util.getType(para);
            var fnType = _util.getType(fn);
            if (paraType === 'array') {
                for (var i = 0; i < para.length; i++) {
                    if (fnType === 'function') fn(i, para[i], para);
                };
            } else if (paraType === 'object') {
                for (var key in para) {
                    if (fnType === 'function') fn(key, para[key], para);
                };
            } else {
                console.log('必须为数组或Json对象')
            }
        },
        //过滤值
        filterValue: function (val) {
            var valType = _util.getType(val), nullVal = ['null', 'undefined', 'NaN'], stringVal = ['boolen', 'number', 'string'];
            if (nullVal.indexOf(valType) >= 0) return '';
            if (stringVal.indexOf(valType) >= 0) return val;
            return JSON.stringify(val);
        }
    }

    var store = {

        /**
         * @function 设置值 替代和增强localStorage的setItem方法
         * @param {string, array, object} _k 必须参数，当为array, object时，类似解构赋值
         * @param {any} _v 非必须参数，当_k为obejct时，会忽略此参数
         * @param {Boolen} _d 非必须，默认为false，是否开启深度遍历赋值
         */
        setItem: function (_k, _v, _d) {
            var _this = this;
            var keyType = _util.getType(_k);
            var valType = _util.getType(_v);

            if (keyType === 'string') {
                _store.setItem(_k, _util.filterValue(_v));
            } else if (keyType === 'array') {
                _util.map(_k, function (i, key) {
                    var val = valType === 'array' ? _v[i] : valType === 'object' ? _v[key] : _v;
                    if (_d) {
                        _this.setItem(key, val);
                    } else {
                        _store.setItem(key, val);
                    }
                })
            } else if (keyType === 'object') {
                _util.map(_k, function (key, val) {
                    if (_d) {
                        _this.setItem(key, val);
                    } else {
                        _store.setItem(key, val);
                    }
                });
            } else {
                console.log('key只能为字符串或者数组')
            }

        },

        /**
         * @function 获取数据 替代和增强localStorage的getItem方法
         * @param {string, array, object} _k 必须参数，当为array, object时，按照对应解构返回数据，深度遍历
         */
        getItem: function (_k) {
            var _this = this, keyType = _util.getType(_k), res;
            if (keyType === 'string') {
                res = _store.getItem(_k);
            } else if (keyType === 'array') {
                res = [];
                _util.map(_k, function (i, val) {
                    res.push(_this.getItem(val));
                })
            } else if (keyType === 'object') {
                res = {};
                _util.map(_k, function (key, val) {
                    res[key] = (_this.getItem(key));
                })
            } else {
                console.log('key只能为字符串、数组和json对象')
            }
            return res;
        },

        /**
         * @function 获取所有数据 增强localStorage
         * @returns 返回一个json对象
         */
        getItems: function () {
            let _this = this, res = {};
            _util.map(_store, function (key, val) {
                res[key] = _this.getItem(key);
            })
            return res;
        },

        /**
         * @function 获取所有key 增强localStorage
         * @returns 返回一个数组
         */
        getKeys: function () {
            let res = [];
            _util.map(_store, function (key, item) {
                res.push(key);
            });
            return res;
        },

        /**
         * @function 移除key 替代和增强localStorage的removeItem
         * @param {string, array, object} _k 必须参数，当为array, object时，深度遍历
         */
        removeItem: function (_k) {
            var _this = this, keyType = _util.getType(_k);
            keys = keyType === 'string' ? [_k] : keyType === 'array' || keyType === 'object' ? _k : [];
            _util.map(keys, function (i, key) {
                _store.removeItem(key);
            });
        },

        /**
         * @function 清除全部key 替代localStorage的clear
         */
        clear: function () {
            _store.clear();
        },

        /**
         * @function 判断是否包含某个key 增强localStorage
         * @param {string} _k 必须参数
         * @return 返回布尔值
         */
        hasKey: function (_k) {
            return typeof _k !== 'undefined' && _store.hasOwnProperty(_k);
        }

    };

    root.store = store;

})(window)

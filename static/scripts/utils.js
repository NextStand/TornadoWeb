/**
 * @author:BLUE
 * @version:1.0
 * @license:ISC
 * @
 * @time:2018-9-19
 */
(function (window, document, $) {
    window.utils = {
        /*-----------------------------数组操作开始----------------------------*/
        bArray: {
            /**
             * 对数组每个元素自定义操作
             * @param {Array} arr 预处理数组
             * @param {Function} fn 对每个数据处理的函数
             * @returns {Array}
             */
            each: function (arr, fn) {
                fn = fn || Function;
                var a = [];
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < arr.length; i++) {
                    var res = fn.apply(arr, [arr[i], i].concat(args));
                    if (res != null) a.push(res);
                }
                return a;
            },
            /**
             * 和原生的map方法一样的用法
             */
            map: function (arr, fun, obj) {
                var scope = obj || window;
                var a = [];
                for (var i = 0, j = arr.length; i < j; ++i) {
                    var res = fn.call(scope, arr[i], i, this);
                    if (res != null) a.push(res);
                }
                return a;
            },
            /**
             * 数组排序
             * @param {Array} array 
             * @param {String} flag 排序方式 asc-正序 desc-倒序 default asc
             * @returns {Array}
             */
            orderBy: function (array, sortFlag) {
                var $arr = array;
                if (sortFlag == 'asc') {
                    $arr.sort(this._numAscSort);
                } else if (sortFlag == 'desc') {
                    $arr.sort(this._numDescSort);
                } else {
                    $arr.sort(this._numAscSort);
                }
                return $arr;
            },
            /**
             * 求两个数组的并集
             * @param {Array} a
             * @param {Array} b
             * @returns {Array}
             */
            union: function (a, b) {
                var newArr = a.concat(b);
                return this.unique2(newArr);
            },
            /**
             * 求两个数组的补集
             * @param {Array} a
             * @param {Array} b
             * @returns {Array}
             */
            complement: function (a, b) {
                return this.minus(this.union(a, b), this.intersect(a, b));
            },
            /**
             * 求两个数组的交集
             * @param {Array} a
             * @param {Array} b
             * @returns {Array} 
             */
            intersect: function (a, b) {
                a = this.unique(a);
                return this.each(a, function (o) {
                    return b.contains(o) ? o : null;
                });
            },
            /**
             * 求两个数组的差集
             * @param {Array} a
             * @param {Array} b
             * @returns {Array} 
             */
            minus: function (a, b) {
                a = this.unique(a);
                return this.each(a, function (o) {
                    return b.contains(o) ? null : o;
                });
            },
            /**
             * 数组去重,返回新数组
             * @param {Array} arr
             * @returns {Array}
             */
            unique: function (arr) {
                var ra = new Array();
                for (var i = 0; i < arr.length; i++) {
                    if (!ra.contains(arr[i])) {
                        //if(this.contains(ra,arr[i])){
                        ra.push(arr[i]);
                    }
                }
                return ra;
            },
            /**
             * 数组去重,原数组操作
             * @param arr
             * @returns {Object}
             */
            unique2: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length;) {
                        if (arr[j] == arr[i]) {
                            arr.splice(j, 1);
                        } else {
                            j++;
                        }
                    }
                }
                return arr;
            },
            /**
             * 数组去重,返回新数组,不同算法
             * @param {Array} arr
             * @returns {Array}
             */
            unique3: function (arr) {
                var result = [],
                    hash = {};
                for (var i = 0, elem;
                    (elem = arr[i]) != null; i++) {
                    if (!hash[elem]) {
                        result.push(elem);
                        hash[elem] = true;
                    }
                }
                return result;
            },
            /**
             * 获取元素数组的下标
             * @param {Array} arr
             * @param {Object} val
             * @returns {Number}
             */
            indexOf: function (arr, val) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == val) {
                        return i;
                    }
                }
                return -1;
            },
            /**
             * 判断一个元素是否在一个数组中
             * @param {Array} arr
             * @param {Object} val
             * @returns {boolean}
             */
            contains: function (arr, val) {
                return this.indexOf(arr, val) != -1 ? true : false;
            },
            /**
             * 根据索引删除数组元素
             * @param {Array} arr
             * @param {Number} indexs
             * @returns {Array}
             */
            remove: function (arr, indexs) {
                var index = this.indexOf(arr, indexs);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                return arr;
            },
            /**
             * 删除数组元素
             * @param {Array} arr
             * @param {Object} val
             */
            removeAry: function (arr, val) {
                arr.splice(arr.indexOf(val), 1);
            },
            /**
             * 根据值删除json
             * @param {Array} arr
             * @param {Object} item
             * @returns {Array}
             */
            removeObject: function (arr, item) {
                for (var i = 0; i < arr.length; i++) {
                    var jsonData = arr[i];
                    for (var key in jsonData) {
                        if (jsonData[key] == item) {
                            arr.splice(i, 1);
                        }
                    }
                }
                return arr;
            },
            /**
             * 求数组最大值
             * @param {Array} arr
             * @returns {Number}
             */
            arrMax: function (arr) {
                return Math.max.apply(null, arr);
            },
            /**
             * 求数组最小值
             * @param {Array} arr
             * @returns {Number}
             */
            arrMax: function (arr) {
                return Math.min.apply(null, arr);
            },
            /**
             * 将类数组转换为数组的方法
             * @param {likeArray} ary
             * @returns {Array}
             */
            formArray: function (ary) {
                var arr = [];
                if (Array.isArray(ary)) {
                    arr = ary;
                } else {
                    arr = Array.prototype.slice.call(ary);
                };
                return arr;
            },
            /**
             * 定义一个数组排序的方法
             * 默认为升序排序asc,
             * 如果传递是参数是一个的话，那么就是是升序，如果传递的参数是两个的话，如果第一个参数不能转换为数组的话，也直接退出
             * 参数:acs:表示升序
             * 参数:desc:表示降序
             * @returns {Object}
             */
            arrySort: function () {
                var arg = arguments;
                var len = arg.length;
                var ary = this.arryList(arg[0]);
                //如果没传递参数，或者传递的不能转换为数组的话就直接返回
                if (!len || Array.isArray(ary) == false) {
                    return false;
                };
                if (len == 1) {
                    return ary.sort(function (a, b) {
                        return a - b;
                    });
                } else {
                    return ary.sort(function (a, b) {
                        if (arg[1] == "desc") {
                            return b - a;
                        } else if (arg[1] == "asc") {
                            return a - b;
                        } else {
                            return a - b;
                        };
                    });
                };
            },
            /**
             * 数组求和
             * @param {Array} arr
             * @returns {number}
             */
            arrSum: function (arr) {
                var ary = [];
                var result = 0;
                if (arr instanceof Array) {
                    ary = arr;
                } else {
                    ary = this.formArray(arr);
                };
                for (var i = 0; i < ary.length; i++) {
                    result += parseFloat(ary[i]);
                };
                return result;
            },
            /**
             * 数组判断
             * @param {Object} arr
             * @returns {Boolean}
             */
            isArray: function (arr) {
                return Object.prototype.toString.call(arr) === '[object Array]';
            },
            /**
             * 随机返回数组中一个元素
             * @param {Array} ary
             * @returns {Object}
             */
            randomItem: function (ary) {
                return ary[Math.ceil(Math.random() * ary.length)];
            },
            /**
             * 判断数组是否有重复的项
             * @param {Array} arr
             * @returns {Boolean}
             */
            isRepeat: function (arr) { //arr是否有重复元素
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]]) return true;
                    hash[arr[i]] = true;
                }
                return false;
            },
            /*--------------以下为数组操作私有方法------------------*/
            _numAscSort: function (a, b) {
                return a - b;
            },
            _numDescSort: function (a, b) {
                return b - a;
            },
            _sortAsc: function (x, y) {
                if (x > y) {
                    return 1;
                } else {
                    return -1;
                }
            },
            _sortDesc: function (x, y) {
                if (x > y) {
                    return -1;
                } else {
                    return 1;
                }
            }
        },
        /*-----------------------------数组操作结束----------------------------*/

        /*-----------------------------日期操作开始----------------------------*/
        bDate: {
            /**
             * 字符串转换成Date
             * @param {String} str
             */
            transdate: function (str) {
                if (typeof str == "string") {
                    return new Date(str.replace(/-/ig, "/"));
                } else {
                    return str;
                }
            },
            /**
             * 时间日期差
             * @param date1
             * @param date2
             * @returns {Date}
             */
            diffdate: function (date1, date2) {
                var dateTime = this.diffmillsecond(date1, date2);
                return new Date(dateTime).format("yyyy-MM-dd");
            },
            /**
             * 时间年份差
             * @param date1
             * @param date2
             * @returns {Number}
             */
            diffyear: function (date1, date2) {
                var times = this.diffday(date1, date2);
                return Math.floor(times / 365);
            },

            /**
             * 时间月份差
             * @param date1
             * @param date2
             * @returns {Number} 
             */
            diffmonth: function (date1, date2) {
                var times = this.diffday(date1, date2);
                return Math.floor(times / 30);
            },

            /**
             * 时间天数差
             * @param date1
             * @param date2
             * @returns {Number} 
             */
            diffday: function (date1, date2) {
                var times = this.diffsecond(date1, date2);
                var hour = this._var().hour;
                var mills = this._var().mills;
                return Math.ceil(times / (mills * hour));
            },

            /**
             * 时间小时差
             * @param date1
             * @param date2
             * @returns {Number} 
             */
            diffhour: function (date1, date2) {
                return Math.floor(this.diffmillsecond(date1, date2) / (1000 * 60 * 60));
            },

            /**
             * 时间分钟差
             * @param date1
             * @param date2
             * @returns {Number} 
             */
            diffminute: function (date1, date2) {
                return Math.floor(this.diffmillsecond(date1, date2) / (1000 * 60));
            },

            /**
             * 时间秒针差
             * @param date1
             * @param date2
             * @returns {Number} 
             */
            diffsecond: function (date1, date2) {
                return Math.floor(this.diffmillsecond(date1, date2) / 1000);
            },

            /**
             * 时间毫秒差
             * @param date1
             * @param date2
             * @returns {Number} 
             */
            diffmillsecond: function (date1, date2) {
                var stimes = this.getTime(this.transdate(date1));
                var etimes = this.getTime(this.transdate(date2));
                return etimes - stimes;
            },

            _var: function () {
                return {
                    hour: 24,
                    second: 60,
                    mills: 3600,
                    format: "yyyy-MM-dd",
                    dateFormat: "yyyy-MM-dd HH:mm:ss"
                };
            },

            /**
             * 某个日期加上多少毫秒
             * @param date
             * @param millisSeconds
             * @returns {Date}
             */
            plusmsecond: function (date, millisSeconds) {
                var dateTime = this.getTime(date);
                var mintimes = millisSeconds;
                var rdate = dateTime * 1 + mintimes * 1;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期加上多少秒
             * @param date
             * @param seconds
             * @returns {Date}
             */
            plussecond: function (date, seconds) {
                var dateTime = this.getTime(date);
                var mintimes = seconds * 1000;
                var rdate = dateTime * 1 + mintimes * 1;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期加上多少分钟
             * @param date
             * @param minutes
             * @returns {Date}
             */
            plusminutes: function (date, minutes) {
                var dateTime = this.getTime(date);
                var mintimes = minutes * 60 * 1000;
                var rdate = dateTime * 1 + mintimes * 1;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期加上小时
             * @param date
             * @param hours
             * @returns {Date}
             */
            plushours: function (date, hours) {
                var dateTime = this.getTime(date);
                var mintimes = hours * 60 * 60 * 1000;
                var rdate = dateTime + mintimes;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期加上天数
             * @param date
             * @param days
             * @returns {Date}
             */
            plusdays: function (date, days) {
                var dateTime = this.getTime(date);
                var mintimes = days * 60 * 60 * 1000 * 24;
                var rdate = dateTime * 1 + mintimes * 1;
                return this.format(new Date(rdate));
            },

            /**
             * 某个日期加上多少个月,这里是按照一个月30天计算
             * @param date
             * @param months
             * @returns {Date}
             */
            plusmonths: function (date, months) {
                var dateTime = this.getTime(date);
                var mintimes = months * 30 * 60 * 60 * 1000 * 24;
                var rdate = dateTime + mintimes * 1;
                return this.format(new Date(rdate));
            },

            /**
             * 某个日期加上多少个年,这里是按照一个月365天来计算天数的，如果loop为true则按闰年计算
             * @param date
             * @param years
             * @param isLoop 是否按照闰年计算，默认平年
             * @returns {Date}
             */
            plusyears: function (date, years, isLoop) {
                var dateTime = this.getTime(date);
                var day = 365;
                if (isLoop) day = 366;
                var mintimes = years * day * 60 * 60 * 1000 * 24;
                var rdate = dateTime + mintimes;
                return this.format(new Date(rdate));
            },

            /**
             * 某个日期减去多少毫秒
             * @param date
             * @param millisSeconds
             * @returns {Date}
             */
            minusmseconds: function (date, millisSeconds) {
                var dateTime = this.getTime(date);
                var mintimes = millisSeconds * 1;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期减去多少秒
             * @param date
             * @param seconds
             * @returns {Date}
             */
            minusseconds: function (date, seconds) {
                var dateTime = this.getTime(date);
                var mintimes = seconds * 1000;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期减去多少分钟
             * @param date
             * @param minutes
             * @returns {Date}
             */
            minusminutes: function (date, minutes) {
                var dateTime = this.getTime(date);
                var mintimes = minutes * 60 * 1000;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期减去小时数
             * @param date
             * @param hours
             * @returns {Date}
             */
            minushours: function (date, hours) {
                var dateTime = this.getTime(date);
                var mintimes = hours * 60 * 60 * 1000;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },
            /**
             * 某个日期减去天数
             * @param date
             * @param days
             * @returns {Date}
             */
            minusdays: function (date, days) {
                var dateTime = this.getTime(date);
                var mintimes = days * 60 * 60 * 1000 * 24;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },

            /**
             * 某个日期减去多少个月,这里是按照一个月30天来计算天数的
             * @param date
             * @param months
             * @returns {Date}
             */
            minusmonths: function (date, months) {
                var dateTime = this.getTime(date);
                var mintimes = months * 30 * 60 * 60 * 1000 * 24;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },

            /**
             * 某个日期减去多少个年,这里是按照一个月365天来计算天数的
             * @param date
             * @param years
             * @param {Boolean} isLoop true--按照闰年计算 default--false
             * @returns {Date}
             */
            minusyears: function (date, years, isLoop) {
                var dateTime = this.getTime(date);
                var day = 365;
                if (isLoop) day = 366;
                var mintimes = years * day * 60 * 60 * 1000 * 24;
                var rdate = dateTime - mintimes;
                return this.format(new Date(rdate));
            },

            /**
             * 获取一个月有多少天
             * @param date1 default new Date()
             * @returns {Number}
             */
            getmonthofday: function (date1) {
                date1 = date1 || new Date();
                var currentMonth = this.getFirstDayOfMonth(date1);
                var nextMonth = this.getNextDayOfMonth(date1);
                return this.diffday(currentMonth, nextMonth);
            },

            /**
             * 获取一年有多少天
             * @param date default new Date()
             * @returns {Number}
             */
            getyearofday: function (date) {
                date = date || new Date();
                var firstDayYear = this._getFirstDayOfYear(date);
                var lastDayYear = this.getlastdayofyear(date);
                return Math.ceil(this.diffday(firstDayYear, lastDayYear));
            },

            /**
             * 某个日期是当年中的第几天
             * @param date1 default new Date() 
             * @returns {Number}
             */
            getdayofyear: function (date1) {
                date1 = date1 || new Date();
                return Math.ceil(this.diffday(this._getFirstDayOfYear(date1), date1));
            },

            /**
             * 某个日期是在当月中的第几天
             * @param date1 default new Date() 
             * @returns {Number}
             */
            getdayofmonth: function (date1) {
                date1 = date1 || new Date()
                return Math.ceil(this.diffday(this.getFirstDayOfMonth(date1), date1));
            },

            /**
             * 获取某个日期在这一年的第几周
             * @param date default new Date() 
             * @returns {Number}
             */
            getdayofyearweek: function (date) {
                date = date || new Date();
                var numdays = this.getdayofyear(date);
                return Math.ceil(numdays / 7);
            },

            /**
             * 某个日期是在当月中的星期几
             * @param date1 default new Date() 
             * @returns {Number}
             */
            getdayofweek: function (date1) {
                date1 = date1 || new Date();
                return this.getWeek(date1);
            },

            /**
             * 获取在当前日期中的小时
             * @param date default new Date() 
             * @returns {Number} 
             */
            gethourofday: function (date) {
                date = date || new Date();
                return this.getHour(date);
            },
            /**
             * 判断两个日期是否相等
             * @param date1
             * @param date2
             * @returns {Boolean}
             */
            eq: function (date1, date2) {
                var stime = this.getTime(this.transdate(date1));
                var etime = this.getTime(this.transdate(date2));
                return stime == etime ? true : false;
            },
            /**
             * 某个日期是否晚于某个日期
             * @param date1
             * @param date2
             * @returns {Boolean}
             */
            after: function (date1, date2) {
                var stime = this.getTime(this.transdate(date1));
                var etime = this.getTime(this.transdate(date2));
                return stime < etime ? true : false;
            },

            /**
             * 某个日期是否早于某个日期
             * @param date1
             * @param date2
             * @returns {Boolean}
             */
            before: function (date1, date2) {
                var stime = this.getTime(this.transdate(date1));
                var etime = this.getTime(this.transdate(date2));
                return stime > etime ? true : false;
            },

            /*获取某年的第一天*/
            _getFirstDayOfYear: function (date) {
                var year = this.getYear(date);
                var dateString = year + "-01-01 00:00:00";
                return dateString;
            },

            /**
             * 获取某年的最后一天
             * @param date default new Date() 
             * @returns {String}
             */
            getlastdayofyear: function (date) {
                date = date || new Date();
                var year = this.getYear(date);
                var dateString = year + "-12-01 00:00:00";
                var endDay = this.getmonthofday(dateString);
                return year + "-12-" + endDay + " 23:59:59";
            },

            /**
             * 获取某月的第一天
             * @param date default new Date() 
             * @returns {String} 
             */
            getFirstDayOfMonth: function (date) {
                date = date || new Date();
                var year = this.getYear(date);
                var month = this.getMonth(date);
                var dateString = year + "-" + month + "-01 00:00:00";
                return dateString;
            },

            /**
             * 获取某月的第一天
             * @param date default new Date() 
             * @returns {String} 
             */
            getLastDayOfMonth: function (date) {
                date = date || new Date();
                var endDay = this.getmonthofday(date);
                var year = this.getYear(date);
                var month = this.getMonth(date);
                return year + "-" + month + "-" + endDay + " 23:59:59";
            },
            /**
             * 一天的开始时间
             * @param date default new Date() 
             * @returns {String} 
             */
            getFirstOfDay: function (date) {
                date = date || new Date();
                var year = this.getYear(date);
                var month = this.getMonth(date);
                var dates = this.getDay(date);
                return year + "-" + month + "-" + dates + " 00:00:00";
            },

            /**
             * 一天的结束时间
             * @param date default new Date() 
             * @returns {String} 
             */
            getLastOfDay: function (date) {
                date = date || new Date();
                var year = this.getYear(date);
                var month = this.getMonth(date);
                var dates = this.getDay(date);
                return year + "-" + month + "-" + dates + " 23:59:59";
            },

            /**
             * 获取下个月的第一天
             * @param date default new Date() 
             * @returns {String} 
             */
            getNextDayOfMonth: function (date) {
                date = date || new Date();
                var year = this.getYear(date);
                var month = this.getMonth(date);
                month = month * 1 + 1;
                if (month > 12) {
                    year = year + 1;
                    month = month - 12;
                }
                month = month > 9 ? month : "0" + month;
                var dateString = year + "-" + month + "-01 00:00:00";
                return dateString;
            },
            /**
             * 一周第一天
             * @param date1 default new Date() 
             * @returns {String} 
             */
            getFirstOfWeek: function (date1) {
                date1 = date1 || new Date();
                var week = this.getWeek(date1);
                var date = this.minusdays(date1, week);
                var year = this.getYear(date);
                var month = this.getMonth(date);
                var dates = this.getDay(date);
                return year + "-" + month + "-" + dates + " 00:00:00";
            },
            /**
             * 一周最后一天
             * @param date1 default new Date() 
             * @returns {String} 
             */
            getLastOfWeek: function (date1) {
                date1 = date1 || new Date();
                var week = 6 - this.getWeek(date1);
                var date = this.minusdays(date1, week);
                var year = this.getYear(date);
                var month = this.getMonth(date);
                var dates = this.getDay(date);
                return year + "-" + month + "-" + dates + " 23:59:59";
            },

            getNow: function () {
                return new Date();
            },
            format: function (date) {
                return this.getYear(date) + "-" + this.getMonth(date) + "-" + this.getDay(date) + " " + this.getHour(date) + ":" + this.getMinute(date) + ":" + this.getSecond(date);
            },
            getDate: function () {
                return this.getNow();
            },
            /*年*/
            getYear: function (date) {
                return this.transdate(date).getFullYear();
            },

            /*月*/
            getMonth: function (date) {
                var month = this.transdate(date).getMonth() + 1;
                return month > 9 ? month : "0" + month;
            },

            /*日*/
            getDay: function (date) {
                var day = this.transdate(date).getDate();
                return day > 9 ? day : "0" + day;
            },

            /*获取今天星期几,如果为0代表星期日*/
            getWeek: function (date) {
                return this.transdate(date).getDay();
            },

            /*时*/
            getHour: function (date) {
                var hour = this.transdate(date).getHours();
                return hour > 9 ? hour : "0" + hour;
            },

            /*12小时制时*/
            getHour12: function (date) {
                var hour = this.transdate(date).getHours();
                return hour % 12 == 0 ? 12 : hour % 12;
            },

            /*分*/
            getMinute: function (date) {
                var minutes = this.transdate(date).getMinutes();
                return minutes > 9 ? minutes : "0" + minutes;
            },

            /*秒*/
            getSecond: function (date) {
                var seconds = this.transdate(date).getSeconds();
                return seconds > 9 ? seconds : "0" + seconds;
            },

            /*毫秒*/
            getMillisecond: function (date) {
                return this.transdate(date).getMilliseconds();
            },

            /*获取今天在当年是第几季度*/
            getPeriod: function (date) {
                var month = this.getMonth(date) * 1;
                return Math.floor((month + 3) / 3);
            },

            /*星期*/
            nowWeekChinese: function (date) {
                var nowWeek = this.getWeek(date);
                var day = "";
                switch (nowWeek) {
                    case 0:
                        day = "日";
                        break;
                        break;
                    case 1:
                        day = "一";
                        break;
                        break;
                    case 2:
                        day = "二";
                        break;
                        break;
                    case 3:
                        day = "三";
                        break;
                        break;
                    case 4:
                        day = "四";
                        break;
                        break;
                    case 5:
                        day = "五";
                        break;
                        break;
                    case 6:
                        day = "六";
                        break;
                }
                return day;
            },

            /*返回 1970 年 1 月 1 日至今的毫秒数。*/
            getTime: function (date) {
                return this.transdate(date).getTime();
            },

            /**
             * 转换long值为日期字符串
             * @param longtime 时间
             * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
             * @return 符合要求的日期字符串
             */
            getFormatDateByLong: function (longTime, pattern) {
                return this.getFormatDate(new Date(longTime), pattern);
            },
            /**
             * 转换日期对象为日期字符串
             * @param l long值
             * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
             * @return 符合要求的日期字符串
             */
            getFormatDate: function (date, pattern) {
                date = date || new Date();
                pattern = pattern || "yyyy-MM-dd hh:mm:ss";

                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(pattern)) {
                    pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(pattern)) {
                        pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return pattern;
            },
            /**
             * 获取时间戳
             * @param obj
             * @returns {Number}
             */
            timeStamp: function () {
                return new Date().getTime();
            },
            /**
             * 返回一个时间格式
             * fmtdate(new Data(),"y-M-d")   "y-M-d"  "y年M月d日"  "y/M/d"
             * fmtdate(new Data(),"H-m-s")   "H-m-s"  "H时m分s秒"  "H/m/s" "H:m:s"
             * fmtdate(new Data(),"y-M-d H:m:s")      "y年M月d日 H时m分s秒"  "y/M/d H/m/s"  "y-M-d H:m:s"
             * fmtdate(new Date(),"MX"))    返回一天中的某个时刻 早晨  中午  下午  晚上  凌晨
             * fmtdate(new Date(),"yyyy") 获取年份
             * fmtdate(new Date(),"MM")    获取月份
             * fmtdate(new Date(),"dd")   获取日
             * fmtdate(new Date(),"HH")   获取小时
             * fmtdate(new Date(),"mm")   获取分
             * fmtdate(new Date(),"ss")  获取秒
             * fmtdate(new Date(),"WD")   获取星期
             * fmtdate(new Date(),"SMX") 获取几个月以前，几年以前
             * 调用方法：var str = utils.bDate.fmtdate(new Data(),"y-M-d")
             * @param {Date} data
             * @param {String} pattern
             * @returns {String}
             */
            fmtdate: function (data, pattern) {
                var month_day = data.getDate();
                var week_day = data.getDay();
                var year_month = data.getMonth() + 1;
                var year_full = data.getFullYear();
                var day_hour = data.getHours();
                var hour_minute = data.getMinutes();
                var minute_seconds = data.getSeconds();
                var minute_Millisecond = data.getMilliseconds();
                var time_Millisecond = data.getTime();
                if (year_full < 10) {
                    year_full = "0" + year_full
                };
                if (month_day < 10) {
                    month_day = "0" + month_day
                };
                if (day_hour < 10) {
                    day_hour = "0" + day_hour
                };
                if (hour_minute < 10) {
                    hour_minute = "0" + hour_minute
                };
                if (minute_seconds < 10) {
                    minute_seconds = "0" + minute_seconds
                };

                if (pattern == "yyyy" && pattern.length == 4) {
                    return year_full;
                };
                if (pattern == "MM" && pattern.length == 2) {
                    return year_month;
                };
                if (pattern == "dd" && pattern.length == 2) {
                    return month_day;
                };
                if (pattern == "HH" && pattern.length == 2) {
                    return day_hour;
                };
                if (pattern == "mm" && pattern.length == 2) {
                    return hour_minute;
                };
                if (pattern == "ss" && pattern.length == 2) {
                    return minute_seconds;
                };

                if (pattern == "SMX" && pattern.length == 3) {
                    var new_time = new Date();
                    var new_year_month = new_time.getMonth() + 1;
                    var new_day_hour_mnuite = new_time.getMinutes();
                    var new_year = new_time.getFullYear();
                    if ((new_year - data.getFullYear()) >= 1 && (new_year - data.getFullYear() <= 2)) {
                        return "一年以前";
                    }
                    if ((new_year - data.getFullYear()) >= 3 && (new_year - data.getFullYear() <= 5)) {
                        return "三年以前";
                    }
                    if ((new_year - data.getFullYear()) >= 5 && (new_year - data.getFullYear() <= 8)) {
                        return "五年以前";
                    }
                    if ((new_year - data.getFullYear()) >= 10) {
                        return "十年以前";
                    }
                    if (new_day_hour_mnuite - data.getMinutes() >= 3 && new_day_hour_mnuite - data.getMinutes() < 10) {
                        return "刚刚";
                    }
                    if (new_day_hour_mnuite - data.getMinutes() >= 10 && new_day_hour_mnuite - data.getMinutes() < 20) {
                        return "十分钟以前";
                    }
                    if (new_day_hour_mnuite - data.getMinutes() >= 380 && new_day_hour_mnuite - data.getMinutes() < 60) {
                        return "四十分钟以前";
                    }
                    if ((new_year_month - data.getMonth() + 1) >= 1 && (new_year_month - data.getMonth() + 1) < 3) {
                        return "一个月以前";
                    }
                    if ((new_year_month - data.getMonth() + 1) > 3 && (new_year_month - data.getMonth() + 1) < 6) {
                        return "三个月以前";
                    }
                    if ((new_year_month - data.getMonth() + 1) > 6 && (new_year_month - data.getMonth() + 1) < 11) {
                        return "半年以前";
                    }
                }

                /*-------------------------------WD  返回星期----------start---------*/
                if (pattern == "WD" && pattern.length == 2) {
                    var w_d;
                    switch (data.getUTCDay()) {
                        case 0:
                            w_d = "星期天";
                            break;
                        case 1:
                            w_d = "星期一";
                            break;
                        case 2:
                            w_d = "星期二";
                            break;
                        case 3:
                            w_d = "星期三";
                            break;
                        case 4:
                            w_d = "星期四";
                            break;
                        case 5:
                            w_d = "星期五";
                            break;
                        case 6:
                            w_d = "星期六";
                            break;
                    }
                    return w_d;
                }
                /*-------------------------------WD  返回星期----------end---------*/

                /*-------------------------------MX 返回一天中的某个时刻--start-------------------*/
                if (pattern == "MX" && pattern.length == 2) {
                    if (day_hour < 11 && day_hour > 6) {
                        return "早晨";
                    }
                    if (day_hour <= 14 && day_hour >= 11) {
                        return "中午";
                    }
                    if (day_hour > 14 && day_hour < 19) {
                        return "下午";
                    }
                    if (day_hour >= 19 && day_hour <= 23) {
                        return "晚上";
                    }
                    if (day_hour < 6 && day_hour >= 0) {
                        return "凌晨";
                    }
                }
                /*-------------------------------MX 返回一天中的某个时刻--end------------------*/

                /*-------------------------------y-M-d H-m-s-------------start---------------------*/
                //"y年M月d日 H时m分s秒"
                var reg = /^(y{1,4}).?(M{1,2}).?(d{1,2})(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)?\s?(H{1,2}).?(m{1,2}).?(s{1,2})(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)?/;
                var yMdHms_separator_reg = /([-+])|(\/+)|(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)(\s?)([-+])|(\/+)|([:+])|(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)/g;
                var yMdHms_separator = pattern.match(yMdHms_separator_reg);
                var yMdHms = pattern.match(reg);
                if (reg.test(pattern)) {
                    if (pattern.length == 13) {
                        return year_full + yMdHms_separator[0] + year_month + yMdHms_separator[1] + month_day + yMdHms_separator[2] + " " + day_hour + yMdHms_separator[3] + hour_minute + yMdHms_separator[4] + minute_seconds + yMdHms_separator[5];
                    } else {
                        return year_full + yMdHms_separator[0] + year_month + yMdHms_separator[1] + month_day + " " + day_hour + yMdHms_separator[2] + hour_minute + yMdHms_separator[3] + minute_seconds
                    }
                }
                /*-------------------------------y-M-d H-m-s-------------end---------------------*/

                /*-------------------------------y-M-d -------------start-----------------------*/
                if (pattern.length >= 5) {
                    var yMd_separator = pattern.match(/([-+])|(\/+)|(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)/g);
                    var yMd = pattern.match(/^((y{1,4})-(M{1,2})-(d{1,2}))|((y{1,4})\/(M{1,2})\/(d{1,2}))|(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)/g);
                    if (utils.tmArray.arrContains(pattern, "M", false) || utils.tmArray.arrContains(pattern, "年", false)) {
                        if ("y/M/d" === yMd[0] || "y-M-d" === yMd[0] || "y年M月d".indexOf("年") != -1 && "y年M月d".indexOf("月") != -1 && "y年M月d日".indexOf("日") != -1) {
                            if (yMd_separator.length == 3) {
                                return year_full + yMd_separator[0] + year_month + yMd_separator[1] + month_day + yMd_separator[2]
                            };
                            return year_full + yMd_separator[0] + year_month + yMd_separator[1] + month_day
                        };

                    };
                    /*-------------------------------y-M-d -------------end-----------------------*/

                    /*-------------------------------H-m-s -------------start-----------------------*/
                    var Hsm_separator = pattern.match(/([-+])|(\/+)|(:+)|(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)/g);
                    var Hsm = pattern.match(/^((H{1,4})-(m{1,2})-(s{1,2}))|((H{1,4})\/(m{1,2})\/(s{1,2}))|(([\ufe30-\uffA0]|[\u4e00-\u9fa5])+)|((H{1,4}):(m{1,2}):(s{1,2}))/g);
                    if (utils.tmArray.arrContains(pattern, "H", false) || utils.tmArray.arrContains(pattern, "分", false)) {
                        if ("H/m/s" === Hsm[0] || "H-m-s" === Hsm[0] || "H时m分s秒".indexOf("时") != -1 && "H时m分s秒".indexOf("秒") != -1 && "H时m分s秒".indexOf("分") != -1) {
                            if (Hsm_separator.length == 3) {
                                return day_hour + Hsm_separator[0] + hour_minute + Hsm_separator[1] + minute_seconds + Hsm_separator[2]
                            };
                            return day_hour + Hsm_separator[0] + hour_minute + Hsm_separator[1] + minute_seconds;
                        };
                    };
                };
            }
        },
        /*-----------------------------日期操作结束----------------------------*/

        /*-----------------------------文件操作开始----------------------------*/
        bFile: {
            /**
             * 文件大小转换为MB GB KB格式
             * @param {Number} size 
             * @returns {String}
             */
            countFileSize: function (size) {
                var fsize = parseFloat(Number(size), 2);
                var fileSizeString;
                if (fsize < 1024) {
                    fileSizeString = fsize.toFixed(2) + "B";
                } else if (fsize < 1048576) {
                    fileSizeString = (fsize / 1024).toFixed(2) + "KB";
                } else if (fsize < 1073741824) {
                    fileSizeString = (fsize / 1024 / 1024).toFixed(2) + "MB";
                } else if (fsize < 1024 * 1024 * 1024) {
                    fileSizeString = (fsize / 1024 / 1024 / 1024).toFixed(2) + "GB";
                } else {
                    fileSizeString = "0B";
                }
                return fileSizeString;
            },
            /**
             * 获取文件的后缀名
             * @param {String} fileName
             * @returns {String} 不含.
             */
            getExt: function (fileName) {
                if (fileName.lastIndexOf(".") == -1)
                    return fileName;
                var pos = fileName.lastIndexOf(".") + 1;
                return fileName.substring(pos, fileName.length).toLowerCase();
            },
            /**
             * 获取文件的名称
             * @param {String} fileName
             * @returns {String}
             */
            getFileName: function (fileName) {
                var pos = fileName.lastIndexOf(".");
                if (pos == -1) {
                    return fileName;
                } else {
                    return fileName.substring(pos, fileName.length);
                }
            },
            /**
             * 转换html标签
             * @param {String} str
             */
            filterTag: function (str) {
                str = str.replace(/&/ig, "&amp;");
                str = str.replace(/</ig, "&lt;");
                str = str.replace(/>/ig, "&gt;");
                str = str.replace(" ", "&nbsp;");
                return str;
            },
            /**
             * 过滤<script></script>转换
             * @param {String} str
             */
            filterScript: function (str) {
                return str.replace(/(<script)/ig, "&lt;script").replace(/(<script>)/ig, "&lt;script&gt;").replace(/(<\/script>)/ig, "&lt;/script&gt;");
            },
            /**
             * 判断是否为空
             * @param {String} val
             * @returns {Boolean}
             */
            isEmpty: function (val) {
                val = $.trim(val);
                if (val == null)
                    return true;
                if (val == undefined || val == 'undefined')
                    return true;
                if (val == "")
                    return true;
                if (val.length == 0)
                    return true;
                if (!/[^(^\s*)|(\s*$)]/.test(val))
                    return true;
                return false;
            },
            /**
             * 验证是否为图片
             * @param {String} fileName 文件名
             * @returns {Boolean}
             */
            checkImage: function (fileName) {
                return /(gif|jpg|jpeg|png|GIF|JPG|PNG)$/ig.test(fileName);
            },
            /**
             * 验证是否为视频
             * @param {String} fileName 文件名
             * @returns {Boolean}
             */
            checkVideo: function (fileName) {
                return /(mp4|mp3|flv|wav)$/ig.test(fileName);
            },
            /**
             * 验证是否为文档
             * @param {String} fileName 文件名
             * @returns {Boolean}
             */
            checkOffice: function (fileName) {
                return /(doc|docx|xls|xlsx|pdf|txt|ppt|pptx)$/ig.test(fileName);
            }
        },
        /*-----------------------------文件操作结束----------------------------*/

        /*-----------------------------字符操作开始----------------------------*/
        bStr: {
            /**
             * 本函数用于统计字符串的长度，有两种模式切换。
             * “En”英文主计算模式，将每个中文算作1个字符；“Ch”中文主计算模式，将每个中文算作2个字符长度
             * @param {String} _str 计算目标字符
             * @param {String} _model 计算模式
             * @returns {Number}
             */
            strLen: (function () {
                var trim = function (chars) {
                    return (chars || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
                }

                return function (_str, _model) {
                    _str = trim(_str),
                        _model = _model || "Ch"; //默认是中文
                    var _strLen = _str.length; //获取字符长度
                    if (_strLen == 0) { //如果字符为0直接返回
                        return 0;
                    } else {
                        var chinese = _str.match(/[\u4e00-\u9fa5]/g); //匹配中文
                        //判断是什么模式
                        return _strLen + (chinese && _model == "Ch" ? chinese.length : 0);
                    }
                };
            })(),
            /**
             * 去除字符串两边的空格
             * @param {String} str 目标字符
             * @returns {String}
             */
            trim: function (str) {
                String.prototype.trim = function () {
                    return this.replace(/(^\s*)|(\s*$)/g, "");
                }
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            /**
             * 判断字符串是否是汉字，字段中有空格返回false
             * @param {String} str
             * @returns {Boolean}
             */
            isChinese: function (str) {
                if (/^([\u4e00-\u9fa5]|[\ufe30-\uffA0])*$/.test(this.trim(str)))
                    return true;
                else
                    return false
            }
        },
        /*-----------------------------字符操作结束----------------------------*/
    }
})(window, document, $)
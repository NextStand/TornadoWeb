/**
 * @author:BLUE
 * @version:1.0
 * @license:ISC
 * @time:2018-9-19
 */


(function (window, document, $) {
    /**
     * 浏览器类型判断构造函数
     */
    window.BROWSER = function () {
        var Browser_Name = navigator.appName;
        var Browser_Version = parseFloat(navigator.appVersion);
        var Browser_Agent = navigator.userAgent;
        var Actual_Version, Actual_Name;
        var is_IE = (Browser_Name == "Microsoft Internet Explorer"); //判读是否为ie浏览器
        var is_NN = (Browser_Name == "Netscape"); //判断是否为netscape浏览器
        var is_op = (Browser_Name == "Opera"); //判断是否为Opera浏览器
        if (is_NN) {
            //upper 5.0 need to be process,lower 5.0 return directly
            if (Browser_Version >= 5.0) {
                if (Browser_Agent.indexOf("Netscape") != -1) {
                    var Split_Sign = Browser_Agent.lastIndexOf("/");
                    var Version = Browser_Agent.lastIndexOf(" ");
                    var Bname = Browser_Agent.substring(0, Split_Sign);
                    var Split_sign2 = Bname.lastIndexOf(" ");
                    Actual_Version = Browser_Agent.substring(Split_Sign + 1, Browser_Agent.length);
                    Actual_Name = Bname.substring(Split_sign2 + 1, Bname.length);
                }
                if (Browser_Agent.indexOf("Firefox") != -1) {
                    var Version = Browser_Agent.lastIndexOf("Firefox");
                    Actual_Version = Browser_Agent.substring(Version + 8, Browser_Agent.length);
                    Actual_Name = Browser_Agent.substring(Version, Version + 7);
                }
                if (Browser_Agent.indexOf("Safari") != -1) {
                    if (Browser_Agent.indexOf("Chrome") != -1) {
                        var Split_Sign = Browser_Agent.lastIndexOf(" ");
                        var Version = Browser_Agent.substring(0, Split_Sign);;
                        var Split_Sign2 = Version.lastIndexOf("/");
                        var Bname = Version.lastIndexOf(" ");
                        Actual_Version = Version.substring(Split_Sign2 + 1, Version.length);
                        Actual_Name = Version.substring(Bname + 1, Split_Sign2);
                    } else {
                        var Split_Sign = Browser_Agent.lastIndexOf("/");
                        var Version = Browser_Agent.substring(0, Split_Sign);;
                        var Split_Sign2 = Version.lastIndexOf("/");
                        var Bname = Browser_Agent.lastIndexOf(" ");
                        Actual_Version = Browser_Agent.substring(Split_Sign2 + 1, Bname);
                        Actual_Name = Browser_Agent.substring(Bname + 1, Split_Sign);
                    }
                }
                if (Browser_Agent.indexOf("Trident") != -1) {
                    Actual_Version = Browser_Version;
                    Actual_Name = Browser_Name;
                }
            } else {

                Actual_Version = Browser_Version;
                Actual_Name = Browser_Name;
            }
        } else if (is_IE) {
            var Version_Start = Browser_Agent.indexOf("MSIE");
            var Version_End = Browser_Agent.indexOf(";", Version_Start);
            Actual_Version = Browser_Agent.substring(Version_Start + 5, Version_End)
            Actual_Name = Browser_Name;

            if (Browser_Agent.indexOf("Maxthon") != -1 || Browser_Agent.indexOf("MAXTHON") != -1) {
                var mv = Browser_Agent.lastIndexOf(" ");
                var mv1 = Browser_Agent.substring(mv, Browser_Agent.length - 1);
                mv1 = "遨游版本:" + mv1;
                Actual_Name += "(Maxthon)";
                Actual_Version += mv1;
            }
        } else if (Browser_Agent.indexOf("Opera") != -1) {
            Actual_Name = "Opera";
            var tempstart = Browser_Agent.indexOf("Opera");
            var tempend = Browser_Agent.length;
            Actual_Version = Browser_Version;
        } else {
            Actual_Name = "Unknown Navigator"
            Actual_Version = "Unknown Version"
        }
        /*------------------------------------------------------------------------------
         --Your Can Create new properties of navigator(Acutal_Name and Actual_Version) --
         --Userage:                                                                     --
         --1,Call This Function.                                                        --
         --2,use the property Like This:navigator.Actual_Name/navigator.Actual_Version;--
         ------------------------------------------------------------------------------*/
        navigator.Actual_Name = Actual_Name;
        navigator.Actual_Version = Actual_Version;

        /*---------------------------------------------------------------------------
         --Or Made this a Class.                                                     --
         --Userage:                                                                  --
         --1,Create a instance of this object like this:var browser=new browserinfo;--
         --2,user this instance:browser.Version/browser.Name;                        --
         ---------------------------------------------------------------------------*/
        this.Name = Actual_Name;
        this.Version = Actual_Version;
        this.isFirefox = function () {
            if (Actual_Name.indexOf("Firefox") == -1)
                return false;
            else
                return true;
        }
        this.isSafari = function () {
            if (Actual_Name.indexOf("Safari") == -1)
                return false;
            else
                return true;
        }
        this.isChrome = function () {
            if (Actual_Name.indexOf("Chrome") == -1)
                return false;
            else
                return true;
        }
        //判断是否为ie浏览器
        this.isIE = function () {
            if (Browser_Name == "Microsoft Internet Explorer")
                return false;
            else
                return true;
        }
        //判断是否为ie6浏览器
        this.isCurrIE6 = function () {
            if (Browser_Agent.toLowerCase().indexOf("msie 6.0") != -1)
                return false;
            else
                return true;
        }
        //判断是否为ie7浏览器
        this.isCurrIE6 = function () {
            if (Browser_Agent.toLowerCase().indexOf("msie 7.0") != -1)
                return false;
            else
                return true;
        }
        //判断是否为ie8浏览器
        this.isCurrIE9 = function () {
            if (Browser_Agent.toLowerCase().indexOf("msie 8.0") != -1)
                return false;
            else
                return true;
        }
        //判断是否为ie9浏览器
        this.isCurrIE10 = function () {
            if (Browser_Agent.toLowerCase().indexOf("msie 9.0") != -1)
                return false;
            else
                return true;
        }
        //判断是否为ie11浏览器
        this.isCurrIE11 = function () {
            if ((Browser_Name == "Netscape") && (parseFloat(Browser_Version) >= 5.0) && (Browser_Agent.indexOf("Trident") != -1))
                return false;
            else
                return true;
        }

    };
    /*---------------------------------加密算法开始---------------------------- */
    (function () {
        var hexcase = 0;
        var b64pad = "";
        var chrsz = 8;

        /*
         * 计算一个小数字节的数组的MD5和一个位长
         */
        function core_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);

        }

        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        /*
         * 键控算法
         */
        function core_hmac_md5(key, data) {
            var bkey = str2binl(key);
            if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
            return core_md5(opad.concat(hash), 512 + 128);
        }

        /*
         * 添加整数，包阔在2 ^ 32。使用16位操作来处理一些JS中的bug。
         */
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * 左位运算32位
         */
        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         * 如果字符为为ASCII码，则将字符串转换为小的little-endian 字符数组，为ASCII码> 255的高位字符被忽略
         */
        function str2binl(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
            return bin;
        }

        /*
         * 转换小字节序为字符串
         */
        function binl2str(bin) {
            var str = "";
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str;
        }

        /*
         * 将小字节序数组转换成密文
         */
        function binl2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        }

        /*
         * 将小字节序数组转换成base64编码
         */
        function binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
                    (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
                    ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }
        //MD5
        window.hex_md5 = function (s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }
        //获取base64位编码的MD5值
        window.b64_md5 = function (s) { return binl2b64(core_md5(str2binl(s), s.length * chrsz)); }
        //小字节序加密
        window.str_md5 = function str_md5(s) { return binl2str(core_md5(str2binl(s), s.length * chrsz)); }
        //密钥键控MD5算法
        window.hex_hmac_md5 = function (key, data) { return binl2hex(core_hmac_md5(key, data)); }
        //密钥键控MD5算法base64
        window.b64_hmac_md5 = function (key, data) { return binl2b64(core_hmac_md5(key, data)); }
        //密钥键控MD5小字节序加密
        window.str_hmac_md5 = function (key, data) { return binl2str(core_hmac_md5(key, data)); }
    })()
    /*---------------------------------加密算法结束---------------------------- */


    ///////////////////////////////////以下为工具函数封装/////////////////////////
    /*-----------------------------数组操作开始----------------------------*/
    window.barray = {
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
        window.bdate = {
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
        window.bfile = {
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
        window.bstr = {
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
            },
            /**
             * 判断空并填充空字符
             * @param {any} strs1 判断对象
             * @param {string} def1 预填充字符
             */
            isnull: function (strs1, def1) {
                var isnil = false;
                if (strs1 == undefined || strs1 == null || strs1 == "undefined" || strs1 == "NaN" || strs1 == "Infinity" || strs1 == "&nbsp;" || strs1 == "&#160;" || strs1 == "BsonNull") {
                    strs1 = "";
                    isnil = true;
                };
                if (strs1 + "" == "" && def1 != undefined && def1 != "") strs1 = def1;
                if (isnil && def1 === 0) strs1 = def1;
                return strs1;
            },
            tostr: function (str) {
                var str2 = this.isnull(str, "") + "";
                if (str2 == "") return str2;
                //str2.indexOf('~h%60') == 0 为了支持火狐;
                if (str2.indexOf('~h`') == 0 || str2.indexOf('~h%60') == 0) {
                    if (str2.indexOf('~h%60') == 0) str2 = str2.substr(5); else str2 = str2.substr(3);
                    if (str2 != '') {
                        let st, t, i, rs = [];
                        st = '';
                        for (i = 1; i <= str2.length / 4; i++) {
                            rs[i * 3 - 3] = "%u";
                            rs[i * 3 - 2] = str2.slice(4 * i - 2, 4 * i);
                            rs[i * 3 - 1] = str2.slice(4 * i - 4, 4 * i - 2);
                        };
                        st = rs.join("");
                        st = unescape(st);
                        return (st);
                    } else return ('');
                } else return str2;
            },
            tohex: function (str1) {
                var str = this.isnull(str1, "") + "";
                if (str == "") return str;
                if (str.indexOf('~h`') == 0) return str;
                var t, i, tl = 0, t0 = "", rs = [], t1 = "";
                for (i = 0; i < str.length; i++) {
                    t = str.charCodeAt(i).toString(16);
                    tl = t.length;
                    switch (tl) {
                        case 4: t0 = ""; break;
                        case 2: t0 = "00"; break;
                        case 1: t0 = "000"; break;
                        case 3: t0 = "0"; break;
                        default: t0 = "0000"; break;
                    };
                    t1 = t0 + t;
                    rs[i] = t1.slice(2, 4) + t1.slice(0, 2);
                }
                return ('~h`' + rs.join(""));
            }
        },
        /*-----------------------------字符操作结束----------------------------*/

        /*-----------------------------数字操作开始----------------------------*/
        window.bnum = {
            /**
             * 数字千分位分开
             * @param {Number|String} str
             * @returns {String} 10,000.00
             */
            formatNum: function (str) {
                str = String(str);
                var newStr = "";
                var count = 0;

                if (str.indexOf(".") == -1) {
                    for (var i = str.length - 1; i >= 0; i--) {
                        if (count % 3 == 0 && count != 0) {
                            newStr = str.charAt(i) + "," + newStr;
                        } else {
                            newStr = str.charAt(i) + newStr;
                        }
                        count++;
                    }
                    str = newStr + ".00"; //自动补小数点后两位
                } else {
                    for (var i = str.indexOf(".") - 1; i >= 0; i--) {
                        if (count % 3 == 0 && count != 0) {
                            newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
                        } else {
                            newStr = str.charAt(i) + newStr; //逐个字符相接起来
                        }
                        count++;
                    }
                    str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
                }
                return str
            },
            /**
             * 身份证号码验证
             * @param {String} code
             * @returns {Boolean}
             */
            identityCodeValid: function (code) {
                code = String(code)
                var alert_tip = ""; // 用于提示
                var city = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北 ",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏 ",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外 "
                };
                var pass = true;
                if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
                    alert_tip = "身份证号格式错误";
                    pass = false;
                } else if (!city[code.substr(0, 2)]) {
                    alert_tip = "地址编码错误";
                    pass = false;
                } else {
                    //18位身份证需要验证最后一位校验位
                    if (code.length == 18) {
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        //校验位
                        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++) {
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        if (parity[sum % 11] != code[17]) {
                            alert_tip = "校验位错误(X需大写)";
                            pass = false;
                        }
                    }
                }
                return pass;
            },
            /**
             * 将数字翻译成中文
             * @param {Number} num
             * @returns {String} 123.2-->一百二十三点二
             */
            num2chinese: function (num) {
                var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
                var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
                var a = ("" + num).replace(/(^0*)/g, "").split("."),
                    k = 0,
                    re = "";
                for (var i = a[0].length - 1; i >= 0; i--) {
                    switch (k) {
                        case 0:
                            re = BB[7] + re;
                            break;
                        case 4:
                            if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                                .test(a[0]))
                                re = BB[4] + re;
                            break;
                        case 8:
                            re = BB[5] + re;
                            BB[7] = BB[5];
                            k = 0;
                            break;
                    }
                    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
                        re = AA[0] + re;
                    if (a[0].charAt(i) != 0)
                        re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                    k++;
                }

                if (a.length > 1) // 加上小数部分(如果有小数部分)
                {
                    re += BB[6];
                    for (var i = 0; i < a[1].length; i++)
                        re += AA[a[1].charAt(i)];
                }
                if (re == '一十')
                    re = "十";
                if (re.match(/^一/) && re.length == 3)
                    re = re.replace("一", "");
                return re;
            },
            /**
             * 将数字转换成中文金额
             * @param {Number} Num
             * @returns {String}
             */
            num2chimoney: function (Num) {
                //判断如果传递进来的不是字符的话转换为字符
                if (typeof Num == "number") {
                    Num = new String(Num);
                };
                Num = Num.replace(/,/g, "") //替换tomoney()中的“,”
                Num = Num.replace(/ /g, "") //替换tomoney()中的空格
                Num = Num.replace(/￥/g, "") //替换掉可能出现的￥字符
                if (isNaN(Num)) { //验证输入的字符是否为数字
                    //alert("请检查小写金额是否正确");
                    return "";
                };
                //字符处理完毕后开始转换，采用前后两部分分别转换
                var part = String(Num).split(".");
                var newchar = "";
                //小数点前进行转化
                for (i = part[0].length - 1; i >= 0; i--) {
                    if (part[0].length > 10) {
                        return "";
                        //若数量超过拾亿单位，提示
                    }
                    var tmpnewchar = ""
                    var perchar = part[0].charAt(i);
                    switch (perchar) {
                        case "0":
                            tmpnewchar = "零" + tmpnewchar;
                            break;
                        case "1":
                            tmpnewchar = "壹" + tmpnewchar;
                            break;
                        case "2":
                            tmpnewchar = "贰" + tmpnewchar;
                            break;
                        case "3":
                            tmpnewchar = "叁" + tmpnewchar;
                            break;
                        case "4":
                            tmpnewchar = "肆" + tmpnewchar;
                            break;
                        case "5":
                            tmpnewchar = "伍" + tmpnewchar;
                            break;
                        case "6":
                            tmpnewchar = "陆" + tmpnewchar;
                            break;
                        case "7":
                            tmpnewchar = "柒" + tmpnewchar;
                            break;
                        case "8":
                            tmpnewchar = "捌" + tmpnewchar;
                            break;
                        case "9":
                            tmpnewchar = "玖" + tmpnewchar;
                            break;
                    }
                    switch (part[0].length - i - 1) {
                        case 0:
                            tmpnewchar = tmpnewchar + "元";
                            break;
                        case 1:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                            break;
                        case 2:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                            break;
                        case 3:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                            break;
                        case 4:
                            tmpnewchar = tmpnewchar + "万";
                            break;
                        case 5:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                            break;
                        case 6:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                            break;
                        case 7:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                            break;
                        case 8:
                            tmpnewchar = tmpnewchar + "亿";
                            break;
                        case 9:
                            tmpnewchar = tmpnewchar + "拾";
                            break;
                    }
                    var newchar = tmpnewchar + newchar;
                }
                //小数点之后进行转化
                if (Num.indexOf(".") != -1) {
                    if (part[1].length > 2) {
                        // alert("小数点之后只能保留两位,系统将自动截断");
                        part[1] = part[1].substr(0, 2)
                    }
                    for (i = 0; i < part[1].length; i++) {
                        tmpnewchar = ""
                        perchar = part[1].charAt(i)
                        switch (perchar) {
                            case "0":
                                tmpnewchar = "零" + tmpnewchar;
                                break;
                            case "1":
                                tmpnewchar = "壹" + tmpnewchar;
                                break;
                            case "2":
                                tmpnewchar = "贰" + tmpnewchar;
                                break;
                            case "3":
                                tmpnewchar = "叁" + tmpnewchar;
                                break;
                            case "4":
                                tmpnewchar = "肆" + tmpnewchar;
                                break;
                            case "5":
                                tmpnewchar = "伍" + tmpnewchar;
                                break;
                            case "6":
                                tmpnewchar = "陆" + tmpnewchar;
                                break;
                            case "7":
                                tmpnewchar = "柒" + tmpnewchar;
                                break;
                            case "8":
                                tmpnewchar = "捌" + tmpnewchar;
                                break;
                            case "9":
                                tmpnewchar = "玖" + tmpnewchar;
                                break;
                        }
                        if (i == 0) tmpnewchar = tmpnewchar + "角";
                        if (i == 1) tmpnewchar = tmpnewchar + "分";
                        newchar = newchar + tmpnewchar;
                    }
                }
                //替换所有无用汉字
                while (newchar.search("零零") != -1)
                    newchar = newchar.replace("零零", "零");
                newchar = newchar.replace("零亿", "亿");
                newchar = newchar.replace("亿万", "亿");
                newchar = newchar.replace("零万", "万");
                newchar = newchar.replace("零元", "元");
                newchar = newchar.replace("零角", "");
                newchar = newchar.replace("零分", "");
                if (newchar.charAt(newchar.length - 1) == "元") {
                    newchar = newchar + "整"
                }
                return newchar;
            }
        },
        /*-----------------------------数字操作结束----------------------------*/

        /*-----------------------------正则验证开始----------------------------*/
        window.breg = {
            /**
             * 邮箱验证
             * @param {String} email
             * @returns {Boolean}
             */
            email: function (email) {
                var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                return reg.test(email);
            },
            /**
             * 手机号验证
             * @param {String} mobile
             * @returns {Boolean}
             */
            mobile: function (mobile) {
                var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                return reg.test(mobile);
            },
            /**
             * 固话验证
             * @param {String} tel
             * @returns {Boolean}
             */
            tel: function (tel) {
                var reg = /^0[\d]{2,3}-[\d]{7,8}$/;
                return reg.test(tel);
            },
            /**
             * 身份证验证
             * @param {String} id
             * @returns {Boolean}
             */
            idCard: function (id) {
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                return reg.test(id);
            },
            /**
             * 金额验证(10位整数2位小数)
             * @param {String} str
             * @returns {Boolean}
             */
            amount: function (str) {
                var reg = /^([1-9][\d]{0,10}|0)(\.[\d]{1,2})?$/;
                return reg.test(str);
            },
            /**
             * 正整数验证
             * @param {String|Number} str
             * @returns {Boolean}
             */
            positiveInt: function (str) {
                var reg = /^[1-9]*[1-9][0-9]*$/;
                return reg.test(str);
            },
            /**
             * 整数(不限位数)验证
             * @param {String|Number} str
             * @returns {Boolean}
             */
            int: function (str) {
                var reg = /^-?\d+$/;
                return reg.test(str);
            },
            /**
             * 验证16位或19位银行卡或信用卡号(先把空格replace为空串)
             * @param {String|Number} str 
             * @returns {Boolean}
             */
            bankCard: function (str) {
                var reg = /^\d{16}|\d{19}$/;
                return reg.test(str);
            },
            /**
             * 验证中文
             * @param {String} str
             * @returns {Boolean}
             */
            chinese: function (str) {
                var reg = /[\u4e00-\u9fa5]/g;
                return reg.test(str);
            },
            /**
             * 验证非中文
             * @param {String} str
             * @returns {Boolean}
             */
            noChinese: function (str) {
                var reg = /[^\u4e00-\u9fa5]/g;
                return reg.test(str);
            },
            /**
             * 验证浮点数
             * @param {String|Number} str
             * @returns {Boolean}
             */
            decimalNumber: function (str) {
                var reg = /^\d+(\.\d+)+$/;
                return reg.test(new Number(str));
            },
        },
        /*-----------------------------正则验证结束----------------------------*/

        /*-----------------------------窗体操作开始----------------------------*/
        window.bwin = {
            /**
             * 禁止窗体被选中
             */
            forbiddenSelect: function () {
                $(document).bind("selectstart", function () {
                    return false;
                });
                document.onselectstart = new Function("event.returnValue=false;");
                $("*").css({
                    "-moz-user-select": "none"
                });
            },
            /**
             * 允许窗体被选中
             */
            autoSelect: function () {
                $(document).bind("selectstart", function () {
                    return true;
                });
                document.onselectstart = new Function("event.returnValue=true;");
                $("*").css({
                    "-moz-user-select": ""
                });
            },
            /**
             * 从剪切版中获取内容
             */
            getClipboard: function () {
                if (window.clipboardData) {
                    return (window.clipboardData.getData('text'));
                } else {
                    if (window.netscape) {
                        try {
                            netscape.security.PrivilegeManager
                                .enablePrivilege("UniversalXPConnect");
                            var clip = Components.classes["@mozilla.org/widget/clipboard;1"]
                                .createInstance(Components.interfaces.nsIClipboard);
                            if (!clip) {
                                return;
                            }
                            var trans = Components.classes["@mozilla.org/widget/transferable;1"]
                                .createInstance(Components.interfaces.nsITransferable);
                            if (!trans) {
                                return;
                            }
                            trans.addDataFlavor("text/unicode");
                            clip.getData(trans, clip.kGlobalClipboard);
                            var str = new Object();
                            var len = new Object();
                            trans.getTransferData("text/unicode", str, len);
                        } catch (e) {
                            alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");
                            return null;
                        }
                        if (str) {
                            if (Components.interfaces.nsISupportsWString) {
                                str = str.value
                                    .QueryInterface(Components.interfaces.nsISupportsWString);
                            } else {
                                if (Components.interfaces.nsISupportsString) {
                                    str = str.value
                                        .QueryInterface(Components.interfaces.nsISupportsString);
                                } else {
                                    str = null;
                                }
                            }
                        }
                        if (str) {
                            return (str.data.substring(0, len.value / 2));
                        }
                    }
                }
                return null;
            },
            /**
             * 往剪切版中赋值
             * @param {String} txt
             * @returns {Boolean}
             */
            setClipboard: function (txt) {
                if (window.clipboardData) {
                    window.clipboardData.clearData();
                    window.clipboardData.setData("Text", txt);
                } else if (navigator.userAgent.indexOf("Opera") != -1) {
                    window.location = txt;
                } else if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager
                            .enablePrivilege("UniversalXPConnect");
                    } catch (e) {
                        alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");
                        return false;
                    }
                    var clip = Components.classes['@mozilla.org/widget/clipboard;1']
                        .createInstance(Components.interfaces.nsIClipboard);
                    if (!clip)
                        return;
                    var trans = Components.classes['@mozilla.org/widget/transferable;1']
                        .createInstance(Components.interfaces.nsITransferable);
                    if (!trans)
                        return;
                    trans.addDataFlavor('text/unicode');
                    var str = Components.classes["@mozilla.org/supports-string;1"]
                        .createInstance(Components.interfaces.nsISupportsString);
                    var copytext = txt;
                    str.data = copytext;
                    trans.setTransferData("text/unicode", str, copytext.length * 2);
                    var clipid = Components.interfaces.nsIClipboard;
                    if (!clip)
                        return false;
                    clip.setData(trans, null, clipid.kGlobalClipboard);
                }
            },
            /**
             * 设置光标位置
             * @param ctrl
             * @returns {number}
             */
            setCursortPosition: function (ctrl) {
                var CaretPos = 0; // IE Support
                if (document.selection) {
                    ctrl.focus();
                    var Sel = document.selection.createRange();
                    Sel.moveStart('character', -ctrl.value.length);
                    CaretPos = Sel.text.length;
                }
                // Firefox support
                else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
                    CaretPos = ctrl.selectionStart;
                }
                return (CaretPos);
            },
            /**
             * 获取光标范围内容
             * @param {Object} inputDom
             * @param {Number} startIndex
             * @param {Number} endIndex
             */
            getCaretPosition: function (inputDom, startIndex, endIndex) {
                if (inputDom.setSelectionRange) {
                    inputDom.setSelectionRange(startIndex, endIndex);
                } else if (inputDom.createTextRange) // IE
                {
                    var range = inputDom.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', startIndex);
                    range.moveEnd('character', endIndex - startIndex - 1);
                    range.select();
                }
                inputDom.focus();
            },
            /**
             * 获取选中文本
             * @param inputDom
             * @returns {string}
             */
            getSelectedText: function (inputDom) {
                if (document.selection) // IE
                {
                    return document.selection.createRange().text;
                } else {
                    return inputDom.value.substring(inputDom.selectionStart,
                        inputDom.selectionEnd);
                }
            },
            /**
             * 在光标处插入字符串
             * @param myField:文本框对象
             * @param myValue：要插入的值
             */
            insertAtCursorx: function (myField, myValue) {
                // IE support
                if (document.selection) {
                    myField.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                    sel.select();
                }
                // MOZILLA/NETSCAPE support
                else if (myField.selectionStart || myField.selectionStart == '0') {
                    var startPos = myField.selectionStart;
                    var endPos = myField.selectionEnd;
                    // save scrollTop before insert
                    var restoreTop = myField.scrollTop;
                    myField.value = myField.value.substring(0, startPos) + myValue +
                        myField.value.substring(endPos, myField.value.length);
                    if (restoreTop > 0) {
                        // restore previous scrollTop
                        myField.scrollTop = restoreTop;
                    }
                    myField.focus();
                    myField.selectionStart = startPos + myValue.length;
                    myField.selectionEnd = startPos + myValue.length;
                } else {
                    myField.value += myValue;
                    myField.focus();
                }
            },
            /**
             * 在光标处插入内容
             * @param tc
             * @param str
             */
            insertAtCursor: function (tc, str) {
                var tclen = tc.value.length;
                tc.focus();
                if (typeof document.selection != "undefined") {
                    document.selection.createRange().text = str;
                } else {
                    tc.value = tc.value.substring(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
                }
            },
            /**
             * 阻止冒泡
             * @param e 事件对象
             */
            stopBubble: function (e) {
                // 如果提供了事件对象，则这是一个非IE浏览器
                if (e && e.stopPropagation) {
                    // 因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                } else {
                    // 否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
                }
            },
            /**
             * 刷新当前页面
             */
            refreash: function () {
                window.location.href = window.location.href;
            },
            /**
             * 获取浏览器url中的参数值
             * @param {String} name
             */
            getURLParam: function (name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', "ig").exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
            },
            /**
             * 图片等比例缩放
             * @param ImgD 图片对象
             * @param iwidth ：最大宽度
             * @param iheight ：最大高度
             * @constructor
             */
            drawImage: function (ImgD, iwidth, iheight) {
                //参数(图片,允许的宽度,允许的高度)
                var image = new Image();
                image.src = ImgD.src;
                if (image.width > 0 && image.height > 0) {
                    if (image.width / image.height >= iwidth / iheight) {
                        if (image.width > iwidth) {
                            ImgD.width = iwidth;
                            ImgD.height = (image.height * iwidth) / image.width;
                        } else {
                            ImgD.width = image.width;
                            ImgD.height = image.height;
                        }
                        ImgD.alt = image.width + "×" + image.height;
                    } else {
                        if (image.height > iheight) {
                            ImgD.height = iheight;
                            ImgD.width = (image.width * iheight) / image.height;
                        } else {
                            ImgD.width = image.width;
                            ImgD.height = image.height;
                        }
                        ImgD.alt = image.width + "×" + image.height;
                    }
                }
            },
            /**
             * 获取浏览器类型
             */
            getBrowse: function () {
                var sUA = navigator.userAgent;
                //检测IE浏览器
                if ((navigator.appName == "Microsoft Internet Explorer")) {
                    //检测模拟IE浏览的OPERA。edit at 2006-11-08(ver 0.1.2)
                    if (sUA.indexOf('Opera') != -1) {
                        this.browseKernel = 'Presto';
                        if (window.opera && document.childNodes) {
                            return 'Opera 7+';
                        } else {
                            return 'Opera 6-';
                        }
                    }
                    this.browseKernel = 'Trident';
                    if (sUA.indexOf('Maxthon') != -1) {
                        return 'Maxthon';
                    }
                    if (sUA.indexOf('TencentTraveler') != -1) { //ver 0.1.3
                        return '腾迅TT';
                    }
                    if (document.getElementById) {
                        return "IE5+";
                    } else {
                        return "IE4-";
                    }
                }
                //检测Gecko浏览器
                if (sUA.indexOf('Gecko') != -1) {
                    this.browseKernel = 'Gecko';
                    if (navigator.vendor == "Mozilla") {
                        return "Mozilla";
                    }
                    if (navigator.vendor == "Firebird") {
                        return "Firebird";
                    }
                    if (navigator.vendor.indexOf('Google') != -1 || sUA.indexOf('Google') != -1) {
                        return 'Google';
                    }
                    if (sUA.indexOf('Firefox') != -1) {
                        return 'Firefox';
                    }
                    return "Gecko";
                }
                //Netscape浏览器
                if (sUA.indexOf('Netscape') != -1) {
                    this.browseKernel = 'Gecko';
                    if (document.getElementById) {
                        return "Netscape 6+";
                    } else {
                        return 'Netscape 5-';
                    }
                }
                //检测Safari浏览器
                if (sUA.indexOf('Safari') != -1) {
                    this.browseKernel = 'KHTML';
                    return 'Safari';
                }
                if (sUA.indexOf('konqueror') != -1) {
                    this.browseKernel = 'KHTML';
                    return 'Konqueror';
                }
                //目前世界公认浏览网页速度最快的浏览器，但它占用的系统资源也很大。
                if (sUA.indexOf('Opera') != -1) {
                    this.browseKernel = 'Presto';
                    if (window.opera && document.childNodes) {
                        return 'Opera 7+';
                    } else {
                        return 'Opera 6-';
                    }
                    return 'Opera';
                }
                if ((sUA.indexOf('hotjava') != -1) && typeof (navigator.accentColorName) == 'undefined') {
                    return 'HotJava';
                }
                if (document.all && document.getElementById && navigator.savePreferences && (sUA.indexOf('netfront') < 0) && navigator.appName != 'Blazer') {
                    return 'Escape 5';
                }
                //Konqueror / Safari / OmniWeb 4.5+
                if (navigator.vendor == 'KDE' || (document.childNodes && (!document.all || navigator.accentColorName) && !navigator.taintEnabled)) {
                    this.browseKernel = 'KHTML';
                    return 'KDE';
                }
                if (navigator.__ice_version) {
                    return 'ICEbrowser';
                }
                if (window.ScriptEngine && ScriptEngine().indexOf('InScript') + 1) {
                    if (document.createElement) {
                        return 'iCab 3+';
                    } else {
                        return 'iCab 2-';
                    }
                }
                if (document.layers && !document.classes) {
                    return 'Omniweb 4.2-';
                }
                if (document.layers && !navigator.mimeTypes['*']) {
                    return 'Escape 4';
                }
                if (navigator.appName.indexOf('WebTV') + 1) {
                    return 'WebTV';
                }
                if (sUA.indexOf('netgem') != -1) {
                    return 'Netgem NetBox';
                }
                if (sUA.indexOf('opentv') != -1) {
                    return 'OpenTV';
                }
                if (sUA.indexOf('ipanel') != -1) {
                    return 'iPanel MicroBrowser';
                }
                if (document.getElementById && !document.childNodes) {
                    return 'Clue browser';
                }
                if (document.getElementById && ((sUA.indexOf('netfront') != -1) || navigator.appName == 'Blazer')) {
                    return 'NetFront 3+';
                }
                if ((sUA.indexOf('msie') + 1) && window.ActiveXObject) {
                    return 'Pocket Internet Explorer';
                }
                return "Unknown";
            },
            /**
             * 判断浏览器类型及版本，如果是IE下面要转移到页面中
             */
            isBrowser: function () {
                return new BROWSER();
            },
            /**
             * 设置cookie
             * @param name cookie的名称
             * @param value cookie的值
             * @param day cookie的过期时间
             */
            setCookie: function (name, value, day) {
                if (day !== 0) { //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
                    var expires = day * 24 * 60 * 60 * 1000;
                    var date = new Date(+new Date() + expires);
                    document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
                } else {
                    document.cookie = name + "=" + escape(value);
                }
            },
            /**
             * 获取对应名称的cookie
             * @param {String} name cookie的名称
             * @returns {String} 不存在时，返回null
             */
            getCookie: function (name) {
                var arr
                var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            },
            /**
             * 删除cookie
             * @param {String} name cookie的名称
             */
            delCookie: function (name) {
                setCookie(name, ' ', -1);
            },
        },
        /*-----------------------------窗体操作结束----------------------------*/

        ///////////////////////////////////ajax封装开始/////////////////////////////
        window.http = {
            /**
             * 根据Unicode号正向排序,别修改原参数对象
             * 根据key的字符长度正序排列
             */
            _orderParams: function (params) {
                var str = "",
                    arr = [];
                arr = Object.keys(params).sort();
                for (var i = 0, len = arr.length; i < len; i++) {
                    str += bstr.tostr(params[arr[i]]);
                }
                return str;
            },
            /**
             * 参数预处理，将参数处理成对象
             * @param {Object} params 参数，可能有两种形式  a=1&b=2 和{a:1,b:2} 
             * @returns {Object}
             */
            _parse: function (params) {
                /**
                 * 每个结果参数对象添加   _timestamp 和 _authtoken
                 * _timestamp 整数时间戳s，不是毫秒
                 * _authtoken md5(authorization+uid+_timestamp+参数排序后的参数值拼接)转大写 
                 * authorization 每个客户端唯一授权码 cookie中取_BAUTH，取不到赋值为‘000000’，cookie取法在楼上窗体操作部分
                 * uid  用户id cookie中取_BUUID，取不到赋值为‘000000’
                 * md5加密算法在楼上
                 */
                /**
                 * 生成的参数样子
                 * {
                 *  k1:v1,
                 *  k2:v2,
                 *  _timestamp:1537433367
                 *  _authtoken:72697333480112ACCFAF067736ABF5DE
                 * }
                 */
                var obj = {};
                if (typeof params === "string") {
                    if (params.indexOf("=") > -1) {
                        var arr = params.split("&");
                        for (var i = 0, len = arr.length; i < len; i++) {
                            var _arr = arr[i].split("=");
                            obj[_arr[0]] = _arr[1];
                        }
                    } else {
                        obj = {}
                    }
                } else if (typeof params === "object") {
                    obj = params;
                };

                if (typeof params === "object") {
                    var _time = parseInt(new Date().getTime() / 1000);
                    var _authtoken = hex_md5(
                        (utils.bWin.getCookie("_BAUTH") ? utils.bWin.getCookie("_BAUTH") : "000000") +
                        (utils.bWin.getCookie("_BUUID") ? utils.bWin.getCookie("_BUUID") : "000000") +
                        (_time) + (this._orderParams(params))).toUpperCase();
                    obj._timestamp = _time;
                    obj._authtoken = _authtoken;
                }
                return obj;
            },

            /**
             * get请求用与于获取数据,dataType为json
             * @param {String} api 接口
             * @param {Object} params 参数对象
             * @param {Function} callback1 成功的回调
             * @param {Function} callback2 失败的回调
             */
            GET: function (api, params, callback1, callback2) {
                $.ajax({
                    type: "GET",
                    url: api,
                    data: params,
                    success: callback1 && callback1 instanceof Function && callback1(),
                    error: callback2 && callback2 instanceof Function && callback1(),
                })
            },
            /**
             * POST请求用与于新增数据,dataType为json
             * @param {String} api 接口
             * @param {Object} params 参数对象
             * @param {Function} callback1 成功的回调
             * @param {Function} callback2 失败的回调
             */
            POST: function (api, params, callback1, callback2) {
                //请求头中添加X-XSRFToken,值为cookie中的_xsrf，cookie取法在楼上窗体操作部分
                var param = this._parse(params);
                $.ajax({
                    type: "POST",
                    url: api,
                    data: param,
                    dataType: "json",
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("X-XSRFToken", utils.bWin.getCookie("_xsrf"));
                    },
                    success: callback1 && callback1 instanceof Function && callback1(),
                    error: callback2 && callback2 instanceof Function && callback1(),
                })
            },
            /**
             * DELETE请求用与于删除数据,dataType为json
             * @param {String} api 接口
             * @param {Object} params 参数对象
             * @param {Function} callback1 成功的回调
             * @param {Function} callback2 失败的回调
             */
            DELETE: function (api, params, callback1, callback2) {
                //请求头中添加X-XSRFToken,值为cookie中的_xsrf，cookie取法在楼上窗体操作部分
                var param = this._parse(params);
                $.ajax({
                    type: "DELETE",
                    url: api,
                    data: param,
                    dataType: "json",
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("X-XSRFToken", utils.bWin.getCookie("_xsrf"));
                    },
                    success: callback1 && callback1 instanceof Function && callback1(),
                    error: callback2 && callback2 instanceof Function && callback1(),
                })
            },
            /**
             * get请求用与于修改数据,dataType为json
             * @param {String} api 接口
             * @param {Object} params 参数对象
             * @param {Function} callback1 成功的回调
             * @param {Function} callback2 失败的回调
             */
            PUT: function (api, params, callback1, callback2) {
                //请求头中添加X-XSRFToken,值为cookie中的_xsrf，cookie取法在楼上窗体操作部分
                var param = this._parse(params);
                debugger;
                $.ajax({
                    type: "PUT",
                    url: api,
                    data: param,
                    dataType: "json",
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("X-XSRFToken", utils.bWin.getCookie("_xsrf"));
                    },
                    success: callback1 && callback1 instanceof Function && callback1(),
                    error: callback2 && callback2 instanceof Function && callback1(),
                })
            },
        }
    ///////////////////////////////////ajax封装结束/////////////////////////////


    ///////////////////////////////////WebSocket封装开始/////////////////////////////

    window.socket = {
        //pass
    }
    ///////////////////////////////////WebSocket封装结束/////////////////////////////


    /*---------------------------------原型扩展开始----------------------------*/
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.ltrim = function () {
        return this.replace(/(^\s*)/g, "");
    }
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new
     * Date().format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
     * Date().format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new
     * Date().format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
     * Date().format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new
     * Date().format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     * 使用方式：(new Date()).format("yyyy-MM-dd);
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            // 月份
            "d+": this.getDate(),
            // 日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
            // 小时
            "H+": this.getHours(),
            // 小时
            "m+": this.getMinutes(),
            // 分
            "s+": this.getSeconds(),
            // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            // 季度
            "S": this.getMilliseconds()
            // 毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt
                .replace(
                    RegExp.$1,
                    ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
                    (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    /**
     * 判断一个数组元素是不是在数组里面
     * @param obj
     * @returns {boolean}
     */
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
    /**
     * 获取数组最大的值
     * @returns {number}
     */
    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };
    /**
     * 获取数组中最小的值
     * @returns {number}
     */
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };
    /**
     * 过滤数组中重复的，如果是数组对象就传递一个参数进去
     * dataSet.uniqueFn("id"),那么就是根据id过滤数组对象
     **/
    Array.prototype.unique = function (key) {
        var arr = this;
        var n = [arr[0]];
        for (var i = 1; i < arr.length; i++) {
            if (key === undefined) {
                if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
            } else {
                inner: {
                    var has = false;
                    for (var j = 0; j < n.length; j++) {
                        if (arr[i][key] == n[j][key]) {
                            has = true;
                            break inner;
                        }
                    }
                }
                if (!has) {
                    n.push(arr[i]);
                }
            }
        }
        return n;
    };
    /**
     * 将json格式化为树形结构数据
     * @param {Object} attributes 格式化参数
     * @returns {JSON} 树形结构数据
     */
    Array.prototype.totree = function (attributes) {
        attributes = Object.assign({
            id: '_id',
            pid: 'pid',
            rootId: 0
        }, attributes)
        if ((this instanceof Array) && this.length > 0) {
            var resData = this,
                tree = [];
            for (var i = 0; i < resData.length; i++) {
                if (resData[i][attributes.pid] == attributes.rootId) {
                    resData[i]["children"] = new Array();
                    var obj = resData[i];
                    tree.push(obj);
                    resData.splice(i, 1);
                    i--;
                }
            }

            function run(chiArr) {
                if (resData.length !== 0) {
                    for (var i = 0; i < chiArr.length; i++) {
                        for (var j = 0; j < resData.length; j++) {
                            if (chiArr[i][attributes.id] === resData[j][attributes.pid]) {
                                resData[j]["children"] = new Array()
                                var obj = resData[j];
                                chiArr[i].children.push(obj);
                                resData.splice(j, 1);
                                j--;
                            }
                        }
                        run(chiArr[i].children);
                    }
                }
            }
            run(tree);
            return tree;
        } else {
            return new Array();
        }
    }
    /*---------------------------------原型扩展结束----------------------------*/

    /*---------------------------------jQuery扩展开始-------------------------*/
    $.fn.extend({
        /**
         * 提取表单中所有的值
         *
         */
        serializeObject: function () {
            var o = {};
            var a = this.serializeArray(); // 有name和value值才返回
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push($.trim(this.value) || '');
                } else {
                    o[this.name] = $.trim(this.value) || '';
                }
            });

            //如果有保存Date的long精度的，把值带回后台
            $(this).find("input[date-value]").each(function (index, item) {
                if ($(item).attr('date-value')) {
                    o[this.name] = $.trim($(item).attr('date-value')) || '';
                }
            })

            // 处理checkbox不选中也必须把值序列化带到后台，radio不存在这问题（多个radio时可以有些为空值）
            $(this).find("input[type='checkbox'][checkstyle='ccs-checked']").each(function (index, item) {
                if (!$(item).val()) {
                    o[item.name] = $(item).attr("ck-value");
                }
            })

            //处理多选下拉菜单数组问题
            var m = $(this).find("input[multiSelect]").each(function (index, item) {
                if ($(item).val()) {
                    var array = $(item).val().split(';');
                    o[item.name] = (array || '');
                }
            });
            return o;
        },
        /**
         * 根据后台传递过来的json数据填充到form中
         * @param {Object} jsonObject
         */
        fillValue2Form: function (jsonObject) {
            $(this).find('input,select').each(function (index, item) {
                var inputName = $(item).attr('name');
                if (inputName != undefined) {
                    // 支持日期格式化，并且保留long值精度
                    var val = jsonObject[inputName];
                    if ($(item).attr('date-format') != undefined) {
                        $(item).attr('date-value', val);

                        if (!isNaN(val)) { //number
                            val = utils.bDate.getFormatDateByLong(val, $(item).attr('date-format'));
                        } else if (val instanceof Date) {
                            val = utils.bDate.getFormatDate(val, $(item).attr('date-format'));
                        }
                    }
                    $(item).val(val);

                    if (($(item).attr('type') == 'checkbox') && $(item).attr('checkstyle') == 'ccs-checked') {
                        if ('1' == jsonObject[inputName]) {
                            $(item).attr('checked', 'true');
                        }
                        $(item).attr('ck-value', jsonObject[inputName]);
                    }

                    if ($(item).attr('type') == 'radio' && $(item).val() && $(item).val() == jsonObject[inputName]) {
                        $(item).attr('checked', 'true');
                    }
                }
            });
        },

    })
    /*---------------------------------jQuery扩展结束-------------------------*/
})(window, document, $)
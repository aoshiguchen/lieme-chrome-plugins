(function(global){
    Array.prototype.insertFirst = function (item) {
        if(Asgc.types.isArray(item)){
            for(var i = item.length - 1; i >= 0; i--){
                this.splice(0, 0, item[i]);
            }
        }else{
            this.splice(0, 0, item);
        }

        return this;
    };

    let Asgc = {};
    global.Asgc = Asgc;

    // 类型判断工具
    Asgc.types = (function(){
        var types = {};

        types.getType = function(val){
            var typeStrig = toString.call(val);

            return typeStrig.slice(8,typeStrig.length - 1);
        }

        types.isType = function(val,type){

            return types.getType(val) === type;
        }

        types.isString = function(val){

            return types.isType(val,'String');
        }

        types.isNull = function(val){

            return types.isType(val,'Null');
        }

        types.isNumber = function(val){

            return types.isType(val,'Number');
        }

        types.isBoolean = function(val){

            return types.isType(val,'Boolean');
        }

        types.isUndefined = function (val){

            return types.isType(val,'Undefined');
        }

        types.isArray = function(val){

            return types.isType(val,'Array');
        }

        types.isObject = function(val){

            return types.isType(val,'Object');
        }

        types.isRegExp = function(val){

            return types.isType(val,'RegExp');
        }

        types.isFunction = function(val){

            return types.isType(val,'Function');
        }

        types.isWindow = function(val){

            return types.isType(val,'Window');
        }

        types.isArguments = function(val){

            return types.isType(val,'Arguments');
        }

        return types;
    })();

    // 日志工具
    Asgc.Logger = function(name){

        var LEVEL = {
            all: {
                v: 0
            },
            debug: {
                v: 1,
                color: 'gray'
            },
            info: {
                v: 2,
                color: 'green'
            },
            warn: {
                v: 3,
                color: 'blue'
            },
            error: {
                v: 4,
                color: 'red'
            },
            off: {
                v: 5
            }
        };

        function out(data){
            var level = data[0];

            if(LEVEL[level].v < LEVEL[this.level].v) return;

            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var milliSecond =  date.getMilliseconds();

            var info = '%c [Asgc Log] [' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + milliSecond + '] [' + name + ' level:' + level + '] ';
            var params = [];
            params.push(info);
            params.push('color:' + LEVEL[level].color);
            for(var i = 1; i < data.length; i++){
                params.push(data[i]);
            }

            console.log.apply(this,params);
        }

        return {
            /**
             * all
             * debug
             * info
             * warn
             * error
             * off
             * */

            level: 'all',
            setLevel: function(level){
                this.level = level;
            },
            setLevelAll: function(){
                this.level = 'all';
            },
            setLevelDebug: function(){
                this.level = 'debug';
            },
            setLevelInfo: function(){
                this.level = 'info';
            },
            setLevelWarn: function(){
                this.level = 'warn';
            },
            setLevelError: function(){
                this.level = 'error';
            },
            setLevelOff: function(){
                this.level = 'off';
            },
            debug: function(){
                var params = Array.prototype.slice.apply(arguments);
                params.insertFirst('debug');
                out.call(this,params);
            },
            info: function(){
                var params = Array.prototype.slice.apply(arguments);
                params.insertFirst('info');
                out.call(this,params);
            },
            warn: function(){
                var params = Array.prototype.slice.apply(arguments);
                params.insertFirst('warn');
                out.call(this,params);
            },
            error: function(){
                var params = Array.prototype.slice.apply(arguments);
                params.insertFirst('error');
                out.call(this,params);
            }
        };
    };

    Asgc.cache = (function(){
    var storage = window.localStorage;

    return {
        set: function(k,v){
          storage.setItem(k,v);
          return this;
        },

        get: function(k){
          return storage.getItem(k) || '';
        },

        clear: function(){
            storage.clear();

            return this;
        },

        switchLocalStorage: function(){
            storage = window.localStorage;
            return this;
        },

        switchSessionStorage: function(){
            storage = window.sessionStorage;
            return this;
        },

        setJson: function(k,v){
          storage.setItem(k,JSON.stringify(v));
          return this;
        },

        getJson: function(k){

          var val = storage.getItem(k);

          if(!val) return null;
          else return JSON.parse(val);
        },

        setJsonProperty: function(k,property,v){
            var data = this.getJson(k);
            data[property] = v;
            this.setJson(k,data);
            return this;
        },

        getJsonProperty: function(k,property){
            var data = this.getJson(k);

            return data[property];
        },

        getString: function(k){
            return this.get(k);
        },

        getInt: function(k){
            return parseInt(this.get(k));
        },

        getFloat: function(k){
            return parseFloat(this.get(k));
        },

        getNumber: function(k){
            return new Number(this.get(k));
        },

        getBoolean: function(k){
            return this.get(k) === 'true';
        },

        getDate: function(k){
            return new Date(this.get(k));
        },

        //超级设值
        //如：s('a.b.c',10); => a:{b:{c:10}}
        //暂不支持数组下标
        s: function(k,v){
            if(!k) return this;

            var ks = k.split('.');

            if(ks.length === 1) return this.set(k,v);

            var data = this.getJson(ks[0]);

            function solve(data,ks,n){
                if(n === ks.length - 1){
                    data[ks[n]] = v;
                    return;
                }

                if(!data[ks[n]]) data[ks[n]] = {};
                if(!Asgc.types.isObject(data[ks[n]])){
                    logger.error('错误的引用! k:' + k);
                    return;
                }
                solve(data[ks[n]],ks,n+1);
                                
            }

            solve(data,ks,1);

            this.setJson(ks[0],data);

            return this;
        },
        //超级取值
        //如：a:{b:{c:10}} g('a.b.c') => 10
        //暂不支持数组下标
        g: function(k){
            if(!k) return '';
            var ks = k.split('.');

            if(ks.length === 1) return this.get(k);

            var data = this.getJson(ks[0]);

            function solve(data,ks,n){
                if(n === ks.length - 1){
                    return data[ks[n]];
                }

                if(!data[ks[n]]) return '';
                if(!Asgc.types.isObject(data[ks[n]])){
                    logger.error('错误的引用! k:' + k);
                    return '';
                }

                return solve(data[ks[n]],ks,n+1);

            }

            return JSON.stringify(solve(data,ks,1));
        },

        sJson: function(k,v){
          this.s(k,JSON.stringify(v));

          return this;
        },

        gJson: function(k){

          var val = this.g(k);

          if(!val) return null;
          else return JSON.parse(val);
        },

        gString: function(k){
            return this.g(k);
        },

        gInt: function(k){
            return parseInt(this.g(k));
        },

        gFloat: function(k){
            return parseFloat(this.g(k));
        },

        gNumber: function(k){
            return new Number(this.g(k));
        },

        gBoolean: function(k){
            return this.g(k) === 'true';
        },

        gDate: function(k){
            return new Date(this.g(k));
        },

   };
})();

})(window);
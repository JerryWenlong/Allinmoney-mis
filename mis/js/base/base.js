var NAMESPACE = 'MIS'
if(typeof Object.create !== "function"){
	Object.create = function(o){
		function F(){};
		F.prototype = o;
		return new F();
	}
}
(function (global){
	(function(){
		var base = global[NAMESPACE] = Object.create(Object.prototype);
		function initMembers(obj, options) {
            var keys = Object.keys(options);
            var len = keys.length;
            var properties = len ? {} : null;
            while (len) {
                len--;
                var key = keys[len], isprivate = !key.indexOf("_"), member = options[key];
                if ((member && typeof member === 'object') && (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function')) {
                    if (typeof member.enumerable != "boolean") {
                        member.enumerable = isprivate;
                    }
                    properties[key] = member;
                } else if (!isprivate) {
                    properties[key] = { value: member, enumerable: isprivate, configurable: true, writable: true };
                } else {
                    obj[key] = member;
                }
            }
            if (properties) {
                Object.defineProperties(obj, properties);
            }
        };
		function def(options, statics){
			var constructor = getConstructor(options.constructor);
			if(options){
				initMembers(constructor.prototype, options)
			}
			if (statics) {
                initMembers(constructor, statics);
            }
			return constructor;
		}
		var baseInit = function (options) {
			options = options || {};
			for (var p in options) {
				this[p] = options[p];
			}
		};
		var getConstructor = function () {
			return function () {
				var _baseInit = this._baseInit || baseInit;
				_baseInit.apply(this, arguments);
				if (this.create) {
					this.create.apply(this, arguments);
				}
			};
		};
		var initInherice = function (base, options) {
            if (base && options) {
                var keys = Object.keys(options);
                var len = keys.length;
                while (len) {
                    len--;
                    var key = keys[len], isprivate = !key.indexOf("_"), member = options[key];
                    if (member && !isprivate && typeof member === "function") {
                        member._inherited = base[key];
                    }
                }
            }
        };
        var inherited = function (args, newArgs) {
            if (args.callee._inherited) {
                return args.callee._inherited.apply(this, newArgs || args);
            }
        };
		base.derive=function(base, options, statics){
			if(base){
				var constructor = getConstructor();
                var basePrototype = base.prototype;
                var baseInstance = Object.create(basePrototype);
                constructor.prototype = baseInstance;
                Object.defineProperty(baseInstance, "base", { value: basePrototype });
                Object.defineProperty(baseInstance, "inherited", { value: inherited, writable: false, enumerable: false });
                initInherice(baseInstance.base, options);
                Object.defineProperty(baseInstance, "constructor", { value: constructor });
                if (options) {
                    initMembers(baseInstance, options);
                }
                if (statics) {
                    initMembers(constructor, statics);
                }
                return constructor;
			}else{
				return def(options, statics)
			}
		}
	})()
})(window)
function compose(...fns) {
  return fns.reduce(function (f, g) {return function (...args) {return f(g(...args))}})
};
function curry(fn) {
  return function (...xs) {
    if (xs.length === 0) {
      throw Error('EMPTY INVOCATION');
    }
    if (xs.length >= fn.length) {
      return fn(...xs);
    }
    return curry(fn.bind(null, ...xs));
  };
}
var reduce = curry(function (f, init, list) {return list.reduce(f, init)});
var foldl = reduce;
// var foldl = curry(function (f, init, list) {return (list.length === 0) ? init : foldl(f, f(init, list[0]), list.slice(1));});
function flatten(list) {
  return foldl(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, [], list);
}
var map = curry(function (f, list) {return list.map(f)});
var prop = curry(function (prop, obj) {return obj[prop]});
var ifelse = curry(function(test, elsef, f) {return test() ? f() : elsef()});

module.exports = {
  compose,
  pipe: function (...fns) {return compose(...fns.reverse())},

  curry,
  chunk: curry(function (array, chunk_size) {return Array(Math.ceil(array.length / chunk_size)).fill().map(function (_, index) {return index * chunk_size}).map(function (begin) {return array.slice(begin, begin + chunk_size)})}),
  range: function(n) {
    return Array.apply(null,Array(n)).map(function (x,i) {return i})
  },
  debounce: curry(function (fn, timeout) {
    var ref = setTimeout(fn, timeout)
    return {
      ref,
      cancel: function () {return clearTimeout(ref)},
    }
  }),
  schedule: curry(function (fn, interval) {
    var ref = setInterval(fn, interval)
    return {
      ref,
      cancel: function () {return clearInterval(ref)},
    }
  }),

  map,
  reduce,
  foldl,
  foldr: curry(function (f, init, list) {return foldl(f, init, list.reverse())}),
  filter: curry(function (f, list) {return list.filter(f)}),
  flattenMap: curry(function (f, list) {return compose(flatten, map)(f, list)}),

  ifelse,
  unary: curry(function (f, arg) {return f(arg)}),
  not: curry(function (f, ...args) {return !f(...args)}),
  spread: curry(function (f, args) {return f(...args)}),
  gather: curry(function (f, ...args) {return f(args)}),
  partial: curry(function (f, ...presetArgs) {return function (...laterArgs) {return f(...presetArgs, ...laterArgs)}}),
  partialRight: curry(function (f, ...presetArgs) {return function (...laterArgs) {return f(...laterArgs, ...presetArgs)}}),
  partialProps: curry(function(f,presetArgsObj, laterArgsObj) {return f(Object.assign( {}, presetArgsObj, laterArgsObj))}),
  when: curry(function(test, f) {return ifelse(test, function(){return undefined}, f)}),

  flatten,
  unique: function (list) {return list.filter(function (v, i, a) {return a.indexOf(v) === i})},
  tail: function (list) {return list.length > 0 ? list.slice(1) : list},
  reverse: function (list) {return list.reverse()},
  shift: function (list) {return list.shift()},

  prop,
  propEq: curry(function (val, p, obj) {return prop(p)(obj) === val}),
  get: curry(function (obj, p) {return prop(p, obj)}),
  matches: curry(function (rule, obj) {
    for(var k in rule) {
      if ((!obj.hasOwnProperty(k))||obj[k]!==rule[k]) {return false}
    }
    return true;
  }),
  memoize: function (fn) {
    var memo = {};
    var slice = Array.prototype.slice;

    return function() {
      var args = slice.call(arguments);

      if (args in memo) {
        return memo[args];
      }
      return (memo[args] = fn.apply(this, args));
    };
  },
  clone: function (obj) {
    if (! obj) {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj))
  },
};

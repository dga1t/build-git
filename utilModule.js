const util = {
  isString: function (thing) {
    return typeof thing === 'string';
  },

  hash: function (string) {
    const hashInt = 0;

    for (let i = 0; i < string.length; i++) {
      hashInt = hashInt * 31 + string.charCodeAt(i);
      hashInt = hashInt | 0;
    }

    return Math.abs(hashInt).toString(16);
  },

  setIn: function (obj, arr) {
    if (arr.length === 2) {
      obj[arr[0]] = arr[1];
    } else if (arr.length > 2) {
      obj[arr[0]] = obj[arr[0]] || {};
      util.setIn(obj[arr[0]], arr.slice(1));
    }

    return obj;
  },

  lines: function (str) {
    return str.split('\n').filter(function (l) {
      return l !== '';
    });
  },

  flatten: function (arr) {
    return arr.reduce(function (a, e) {
      return a.concat(e instanceof Array ? util.flatten(e) : e);
    }, []);
  },

  unique: function (arr) {
    return arr.reduce(function (a, p) {
      return a.indexOf(p) === -1 ? a.concat(p) : a;
    }, []);
  },

  intersection: function (a, b) {
    return a.filter(function (e) {
      return b.indexOf(e) !== -1;
    });
  },

  onRemote: function (remotePath) {
    return function (fn) {
      const originalDir = process.cwd();
      process.chdir(remotePath);

      const result = fn.apply(null, Array.prototype.slice.call(arguments, 1));
      process.chdir(originalDir);
      return result;
    };
  },
};

var template = require('tmodjs-loader/runtime');

/**
 * 日期格式化
 * 用法：{{时间戳 | dateFormat:'yyyy-MM-dd hh:mm:ss SSS'}}
 */
template.helper('dateFormat', function (timestamp, pattern) {
  var dateFormat = function (date, pattern) {
    date = date || new Date();
    date = date instanceof Date ? date : new Date(date);
    pattern = pattern || 'yyyy-MM-dd hh:mm:ss';
    var map = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    };
    if (/(y+)/.test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(S+)/.test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (date.getMilliseconds() + "").substr(3 - RegExp.$1.length));
    }
    for (var i in map) {
      if (new RegExp("(" + i + ")").test(pattern)) {
        pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? map[i] : ("00" + map[i]).substr(("" + map[i]).length));
      }
    }
    return pattern;
  };
  return dateFormat(timestamp, pattern)
});

module.exports = template;

/**
 * 页面: b
 * 功能描述: 
 * 作者: swg
 */
var templateHelper = require('templateHelper');
var util = require('util');
import jquery from 'jquery';
_
debugger
function Biz() {


}
new Biz();

var beforeFillZero = function(value, digit){
  value = value.toString();
  var zeroNum = digit - value.length;
  for(var i=0;i<zeroNum;i++){
    value = '0' + value;
  }
  return value;
};

var dateFormat = function(date, format){
  date = Object.prototype.toString.call(date) == '[object String]' ? new Date(date) : date || new Date();
  format = Object.prototype.toString.call(format) == '[object String]' ? format : 'yyyy-MM-dd hh:mm:ss';
  var map = {
    'y': date.getFullYear(),
    'M': date.getMonth() + 1,
    'd': date.getDate(),
    'H': date.getHours(),
    'm': date.getMinutes(),
    's': date.getSeconds(),
    'S': date.getMilliseconds()
  };
  for(var key in map){
    format = format.replace(new RegExp(key + '+'), function(matchValue, index, input){
      return beforeFillZero(map[key], matchValue.length);
    });
  }
  return format;
};
console.log(dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss SSS'));

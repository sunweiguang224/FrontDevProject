/**
 * 页面: b
 * 功能描述: 
 * 作者: swg
 */
var templateHelper = require('templateHelper');
var util = require('util');
import jquery from 'jquery';
import moment from 'moment';
_
console.log(moment().format('YYYY-MM-DD HH:mm:ss S'));

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


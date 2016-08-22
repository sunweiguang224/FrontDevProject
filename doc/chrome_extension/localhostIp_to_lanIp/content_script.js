/**
 * Created by weiguangsun on 2016/6/12.
 */
var newUrl = location.href;
newUrl = newUrl.replace('localhost', '10.0.69.136');
newUrl = newUrl.replace('FrontDevProject/src', 'FrontDevProject/dev');
location.href = newUrl;

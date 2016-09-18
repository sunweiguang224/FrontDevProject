/**
 * Created by weiguangsun on 2016/4/20.
 */
import Path from './path.js';
import fs from 'fs';
import webpack from 'webpack';
import glob from 'glob';

//export default {		// 有bug 原因不明
var commonModulePath = __dirname + '/src/common/js/util';
module.exports = {
	resolve: {
		// 为公共资源指定别名，用的时候直接引用别名即可
		alias: {
			helper: commonModulePath + '/helper.js',
      setting: commonModulePath + '/setting.js',
      ua: commonModulePath + '/ua.js',
      util: commonModulePath + '/util.js',
		}
	},
	entry: function(path) {
		var entry = {
			commons: ['helper', 'setting', 'ua', 'util']		// JS工具
		};
		var files = glob.sync(path);
		for (var i = 0; i < files.length; i++) {
			var file = files[i];		// 读取文件路径
			var moduleName = file.replace(Path.srcRoot+'/', '').replace('.js', '');	// 文件编译后路径
			entry[moduleName] = './' + file;
		}
		return entry;
	}(Path.src.js.module),
  plugins: [
    // 将公共代码抽离出来合并为一个文件
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: 'common/js/common.bundle.js',
      minChunks: 5
    }),
    // 提供全局的变量，在模块(entry指定的)中使用无需用require引入，
    new webpack.ProvidePlugin({
      jQuery: "jquery", // jQuery变量提供给jquery-lazyload（因jquery-lazyload内部没有require('jquery')）
      $: "jquery",
      // 下面的暂不使用，哪个页面用就动态引入，提高效率（因提供变量时会执行该变量的生成函数）
      /*_: 'underscore',
      helper: "helper",
      setting: "setting",
      ua: "ua",
      util: "util",*/
    }),
  ],
	output: {
		//path: __dirname + '/.build/js',	//__dirname 是当前模块文件所在目录的完整绝对路径
		//publicPath: '../../js/',		//网站运行时的访问路径 未知
		filename: "[name].bundle.js"
	},
	module: {
		loaders: [
			{test: /\.css$/, loaders: ['style', 'css']},	// style-loader,css-loader共同作用于.css文件。 前者将 css 文件以 <style></style> 标签插入 <head> 头部，后者负责解读、加载 CSS 文件。
			{test: /\.scss$/, loader: 'style!css!sass'},	// sass-loader 加载sass文件。等价于上面数组写法。
			{test: /\.tpl$/, loader: "tmodjs"},	// artTemplate的webpack版
			{test: /\.json$/, loader: "json"},	// json-loader，.json一般用于放假数据
			//{test: /\.png$/, loader: "url-loader?limit=102400" }	//引起gulp-uglify报错，原因不详// require100KB以下的图片将得到base64编码
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
		]
	},
};

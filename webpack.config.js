/**
 * Created by weiguangsun on 2016/4/20.
 */
import Path from './path.js';
import fs from 'fs';
import webpack from 'webpack';
import glob from 'glob';

//export default {		// 有bug 原因不明
module.exports = {
	resolve: {
		// 为公共资源指定别名，用的时候直接引用别名即可
		alias: {
			jQuery: __dirname + '/lib/js/jquery-3.0.0.min.js',
			sizzle: __dirname + '/lib/js/sizzle.min.js',
			templateHelper: __dirname + '/src/util/js/templateHelper.js',
			util: __dirname + '/src/util/js/util.js',
			ua: __dirname + '/src/util/js/ua.js',
			swg: __dirname + '/src/util/js/swg.js'
		}
	},
	entry: function entries(regexPath) {
		var files = glob.sync(regexPath);
		var entry = {}, filePath;
		for (var i = 0; i < files.length; i++) {
			filePath = './' + files[i];
			entry[filePath.replace('./src/', '').replace('.js', '.bundle.js')] = filePath;		// entry名即为发布路径
		}
		entry.common = ['templateHelper', 'jQuery', 'util'/*, 'swg', 'sizzle'*/, 'ua'];
		console.log(entry);
		return entry;
	}(Path.src.js.module),
	output: {
		//path: __dirname + '/.build/js',	//__dirname 是当前模块文件所在目录的完整绝对路径
		//publicPath: '../../js/',		//网站运行时的访问路径 未知
		filename: "[name]"
	},
	module: {
		loaders: [
			{test: /\.css$/, loaders: ['style', 'css']},	// style-loader,css-loader共同作用于.css文件。 前者将 css 文件以 <style></style> 标签插入 <head> 头部，后者负责解读、加载 CSS 文件。
			{test: /\.scss$/, loader: 'style!css!sass'},	// sass-loader 加载sass文件。等价于上面数组写法。
			{test: /\.tpl$/, loader: "tmodjs"},	// artTemplate的webpack版
			{test: /\.json$/, loader: "json"},	// json-loader，.json一般用于放假数据
			//{test: /\.png$/, loader: "url-loader?limit=102400" }	//引起gulp-uglify报错，原因不详// require100KB以下的图片将得到base64编码
		]
	},
	plugins: [
		// 提供全局的变量，在模块(entry指定的)中使用无需用require引入，
		new webpack.ProvidePlugin({
			jQuery: "jQuery",
			$: "jQuery"
		}),
		// 给webpack编译过的js文件加banner
		//new webpack.BannerPlugin('This file is created by swg ' + new Date()), 已经通过gulp来加了
		// 将公共代码抽离出来合并为一个文件
		new webpack.optimize.CommonsChunkPlugin('common', 'common/js/common.bundle.js')
	]
};
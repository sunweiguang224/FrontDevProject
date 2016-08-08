/**
 * gulp配置文件
 * Created by weiguangsun on 2016/4/5.
 * 由gulpfile.js命名为gulpfile.babel.js，gulp读取配置文件时自动调用babel，
 * 前提需要先安装babel-core、babel-preset-es2015、babel-preset-stage-0
 */
// 引入组件
import gulp from 'gulp';
//$ = require('gulp-load-plugins')(),		//插件加载器，启动加载devDependencies中所有插件
import	uglify from 'gulp-uglify';		// js压缩混淆
import	rename from 'gulp-rename';		// 文件重命名
import	sass from 'gulp-sass';			// sass预编译
import	concat from 'gulp-concat';			// 文件合并 .pipe(concat('all.js'
import	minifyHtml from 'gulp-minify-html';		// html压缩
import imagemin from 'gulp-imagemin';		// 图片压缩
import	liveReload from 'gulp-livereload';		// 文件变化时自动刷新浏览器，chrome需要安装LiveReload插件
import	minifyCss from 'gulp-minify-css';		// css压缩
import	replace from 'gulp-replace';		// 文件清除
import	clean from 'gulp-clean';	// 清除目录下的内容
import	runSequence from 'run-sequence';	// 使gulp任务按顺序执行，因为gulp里任务默认是异步执行的
import 	webpack from 'webpack-stream';		//webpack
import	autoprefixer from 'gulp-autoprefixer';		// 自动添加css前缀
import	header from 'gulp-header';		// 自动添加文件头
import	size from 'gulp-size';		// 显示gulp.dest输出到磁盘上的文件尺寸
import	sourcemaps from 'gulp-sourcemaps';		// 生成sourcemaps
import	fs from 'fs';		// 文件操作模块
import	moment from 'moment';		// 时间格式化
import	inquirer from 'inquirer';		// 控制台接收输入
import	babel from 'gulp-babel';		// es6编译
import	fileInclude from 'gulp-file-include';		// 为html引入tpl模板


// ************************************ 变量Path ************************************
const Path = {
	srcRoot: 'src',
	devRoot: 'dev',
	distRoot: 'dist'
};
Path.src = {
	css: Path.srcRoot + '/*(module|common)/**/css/*.scss',
	js: Path.srcRoot + '/common/**/js/*.js',	// common由nodejs负责，module由webpack负责
	img: Path.srcRoot + '/*(module|common)/**/img/*',
	html: Path.srcRoot + '/*(module|common)/**/*.html',
	generator: [
		'src/generator/*.html',
		'src/generator/*/*'
	]
};

/* 获取当前格式化时间 */
function getNow(){
	var m = moment();
	return m.format("YYYY-MM-DD HH:mm:ss ") + m.millisecond();
}

// ************************************ 编译目录清理 ************************************
gulp.task('task_clean_dev', () => {
	console.log('>>>>>>>>>>>>>>> 开发目录开始清理。' + getNow());
	return gulp.src(Path.devRoot).pipe(clean());
});
gulp.task('task_clean_dist', () => {
	console.log('>>>>>>>>>>>>>>> 上线目录开始清理。' + getNow());
	return gulp.src(Path.distRoot).pipe(clean())
});

// ************************************ 编译HTML ************************************
function compileHtml(env){
	console.log('>>>>>>>>>>>>>>> html文件开始编译。' + getNow());
	let meta = fs.readFileSync('./src/util/tpl/meta.tpl', "utf8");
	let remRootSize = fs.readFileSync('./src/util/tpl/remRootSize.tpl', "utf8");
	let v = moment().format("YYYY-MM-DD_HH:mm:ss");
	let min = null;
	if(env == 'dev'){
		min = '';
	}else if(env == 'dist'){
		min = '.min';
	}
	return gulp.src(Path.src.html)
		//.pipe(replace('${{meta}}', meta))
		//.pipe(replace('${{remRootSize}}', remRootSize))
		.pipe(fileInclude({
			prefix: '@@',
			basepath: __dirname + '/src/util/tpl/'
		}))
		.pipe(replace('${{prefix}}', '../..'))
		.pipe(replace('${{suffix}}', 'v=' + v))
		.pipe(replace('${{min}}', min));
}
gulp.task('task_html_dev', () => {
	return compileHtml('dev')
		.pipe(gulp.dest(Path.devRoot))
		.pipe(liveReload());
});
gulp.task('task_html_dist', () => {
	return compileHtml('dist')
		.pipe(minifyHtml())
		.pipe(gulp.dest(Path.distRoot))
		.pipe(size({showFiles: true}));
});

// ************************************ 编译CSS ************************************
function compileCss(){
	console.log('>>>>>>>>>>>>>>> css文件开始编译。' + getNow());
	return gulp.src(Path.src.css)		// return这个流是为了保证任务按顺序执行
		// 开发环境
		.pipe(sourcemaps.init())	// 放到最开始才能对应原始的scss文件
		.pipe(sass({outputStyle: 'uncompressed'}))
		.pipe(autoprefixer());
}
gulp.task('task_css_dev', () => {
	return compileCss()
		.pipe(sourcemaps.write('./'))	// 写到目标css同级目录下
		//.pipe(header('\/* This css was compiled at '+ getNow() +'. *\/\n'))
		.pipe(gulp.dest(Path.devRoot))
		.pipe(liveReload());
});
gulp.task('task_css_dist', () => {
	return compileCss()
		.pipe(minifyCss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(Path.distRoot))
		.pipe(size({showFiles: true}));
});

// ************************************ 编译图片 ************************************
function compileImg(){
	console.log('>>>>>>>>>>>>>>> 图片文件开始编译。' + getNow());
	return gulp.src(Path.src.img);
}
gulp.task('task_img_dev', () => {
	return compileImg()
		.pipe(gulp.dest(Path.devRoot))
		.pipe(liveReload());
});
gulp.task('task_img_dist', () => {
	return compileImg()
		.pipe(imagemin())
		.pipe(gulp.dest(Path.distRoot))
		.pipe(size({showFiles: true}));
});

// ************************************ 编译JS ************************************
function compileJs(env){
	console.log('>>>>>>>>>>>>>>> js文件开始编译。' + getNow());
	let webpackConfig = require("./webpack.config.js");
	return gulp.src('')
		.pipe(webpack(webpackConfig))
		//.pipe(babel({		与tmodjs冲突，弃用
		//	//presets: ['es2015']
		//}))
		.pipe(header('\/* This css was compiled at '+ getNow() +'. *\/\n'));
}
gulp.task('task_js_dev', () => {
	gulp.src(Path.src.js)
		.pipe(gulp.dest(Path.devRoot+'/common/'));
	return compileJs('dev')
		.pipe(gulp.dest(Path.devRoot))
		.pipe(liveReload());
});
gulp.task('task_js_dist', () => {
	gulp.src(Path.src.js)
		.pipe(uglify({
			mangle: true,  // 类型：Boolean 默认：true 是否修改变量名
			compress: true,  // 类型：Boolean 默认：true 是否完全压缩
			preserveComments: 'none'  // all保留所有注释
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(Path.distRoot+'/common/'));
	return compileJs('dist')
		.pipe(uglify({
			mangle: true,  // 类型：Boolean 默认：true 是否修改变量名
			compress: true,  // 类型：Boolean 默认：true 是否完全压缩
			preserveComments: 'none'  // all保留所有注释
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(Path.distRoot))
		.pipe(size({showFiles: true}));
});

// ************************************ 文件编译+监听(npm start) ************************************
// 任务入口
gulp.task('default', [], () => {
	runSequence(
		'task_clean_dev',
		['task_html_dev', 'task_css_dev', 'task_img_dev', 'task_js_dev'],
		function(){
			console.log('>>>>>>>>>>>>>>> gulp全部任务执行完毕。' + getNow());
			// 开启liveReload
			liveReload.listen();
			// 开始监视
			gulp.watch([
				Path.src.html,
				Path.srcRoot + '/util/**/*.html'
			], ['task_html_dev']);
			gulp.watch([
				Path.src.css,
				Path.srcRoot + '/util/**/css/*.scss'
			], ['task_css_dev']);
			gulp.watch([
				Path.src.img,
				Path.srcRoot + '/util/**/*.img'
			], ['task_img_dev']);
			gulp.watch([
				Path.src.js,
				Path.srcRoot + '/util/**/*.js',
				Path.srcRoot + '/module/**/*.js'
			], ['task_js_dev']);
		}
	);
});

// ************************************ 文件编译(npm run build) ************************************
gulp.task('build', [], () => {
	runSequence(
		'task_clean_dist',
		['task_html_dist', 'task_css_dist', 'task_img_dist', 'task_js_dist'],
		function(){
			console.log('>>>>>>>>>>>>>>> gulp全部任务执行完毕。' + getNow());
		}
	);
});

// ************************************ 创建新模块(npm run create) ************************************
gulp.task('create', () => {
	console.log('>>>>>>>>>>>>>>> 开始创建新模块。' + getNow());
	inquirer.prompt([
		{
			type: 'input',
			name: 'module',
			message: 'please input module\'s name ?',
			validate: function (input) {
				return input ? true : false;
			}
		},{
			type: 'input',
			name: 'file',
			message: 'please input file\'s name ?'
		},{
			type: 'input',
			name: 'title',
			message: 'please input page\'s title ?',
			validate: function (input) {
				return input ? true : false;
			}
		},{
			type: 'input',
			name: 'desc',
			message: 'please input module\'s description ?',
			validate: function (input) {
				return input ? true : false;
			}
		},{
			type: 'input',
			name: 'author',
			message: 'please input your name ?',
			default: 'swg',
			validate: function (input) {
				return input ? true : false;
			}
		}
	]).then((answer) => {
		console.log(answer);
		var distDir = Path.srcRoot + '/module/'+answer.module,
			file = answer.file || answer.module;
		gulp.src(Path.src.generator)
			.pipe(rename({
				basename: file
			}))
			.pipe(replace('${{module}}', answer.module))
			.pipe(replace('${{file}}', file))
			.pipe(replace('${{title}}', answer.title))
			.pipe(replace('${{desc}}', answer.desc))
			.pipe(replace('${{author}}', answer.author))
			.pipe(gulp.dest(distDir))
			.on('end', function(){
				fs.mkdir('./'+distDir + '/img')
			})
		;
		console.log('>>>>>>>>>>>>>>> '+answer.module+'模块'+file+'文件创建完毕。' + getNow());
	});
});
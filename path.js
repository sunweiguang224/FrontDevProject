var minimist = require('minimist'); // 获取key-value形势的参数，如 npm run build -- --name login --age 18

// 分模块编译，优先级：命令行 > 指定 > 全部，
var args = minimist(process.argv);
var moduleName = args.name || '' || '*';

// ************************************ 变量Path ************************************
const Path = {
	srcRoot: 'src',
	devRoot: 'dev',
	distRoot: 'dist',
  tempRoot: '.temp'
};
Path.src = {
	css: [
    Path.srcRoot + '/*common/css/**/*.*',     // 原先写法 css: Path.srcRoot + '/*(module|common)/**/css/*.scss',
    Path.srcRoot + '/*module/'+moduleName+'/css/*.scss'
  ],
	icon: Path.srcRoot + '/*module/*/img/*/*', // common模块下图片是公用的，页面之间可以利用缓存，故不作处理
	img: [
    Path.srcRoot + '/*common/img/{*.png, *.jpg}',
    Path.srcRoot + '/*module/'+moduleName+'/img/{*.png, *.jpg}'
  ],
	html: Path.srcRoot + '/*module/'+moduleName+'/*.html',
	js: {
		common: Path.srcRoot + '/*common/js/*.js',	// 由nodejs负责
		module: Path.srcRoot + '/*module/'+moduleName+'/js/*.js'		// 由webpack负责
	},
	generator: [
		'generator/*.html',
		'generator/*/*'
	]
};
module.exports = Path;

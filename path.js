// ************************************ 变量Path ************************************
const Path = {
	srcRoot: 'src',
	devRoot: 'dev',
	distRoot: 'dist'
};
Path.src = {
	css: Path.srcRoot + '/*(module|common)/**/css/*.scss',
	icon: Path.srcRoot + '/*(module)/*/img/*/*', // common模块下图片是公用的，页面之间可以利用缓存，故不作处理
	img: Path.srcRoot + '/*(module|common)/**/img/{*.png, *.jpg}',//
	html: Path.srcRoot + '/*(module)/*/*.html',
	js: {
		common: Path.srcRoot + '/*common/js/*.js',	// 由nodejs负责
		module: Path.srcRoot + '/*module/*/js/*.js'		// 由webpack负责
	},
	generator: [
		'src/generator/*.html',
		'src/generator/*/*'
	]
};

module.exports = Path;

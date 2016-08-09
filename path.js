// ************************************ 变量Path ************************************
const Path = {
	srcRoot: 'src',
	devRoot: 'dev',
	distRoot: 'dist'
};
Path.src = {
	css: Path.srcRoot + '/*(module|common)/**/css/*.scss',
	img: Path.srcRoot + '/*(module|common)/**/img/*',
	html: Path.srcRoot + '/*(module|common)/**/*.html',
	js: {
		common: Path.srcRoot + '/*common/**/js/*.js',	// 由nodejs负责
		module: Path.srcRoot + '/*module/*/js/*.js'		// 由webpack负责
	},
	generator: [
		'src/generator/*.html',
		'src/generator/*/*'
	]
};

module.exports = Path;
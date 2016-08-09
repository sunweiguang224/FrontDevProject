// ************************************ 变量Path ************************************
const Path = {
	srcRoot: 'src',
	devRoot: 'dev',
	distRoot: 'dist'
};
Path.src = {
	css: Path.srcRoot + '/*(module|common)/**/css/*.scss',
	js: {
		common: Path.srcRoot + '/common/**/js/*.js',
		module: Path.srcRoot + '/module/*/js/*.js'
	},	// common由nodejs负责，module由webpack负责
	img: Path.srcRoot + '/*(module|common)/**/img/*',
	html: Path.srcRoot + '/*(module|common)/**/*.html',
	generator: [
		'src/generator/*.html',
		'src/generator/*/*'
	]
};

module.exports = Path;
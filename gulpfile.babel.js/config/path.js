const pathSrc   = './src';
const pathDest  = './public';

export default {
	root	: pathDest,

	php	: {
		src		: [pathSrc + '/html/**/*.php'],
		watch	: pathSrc + '/html/**/*.php',
		dest	: pathDest
	},

	scss	: {
		src		: pathSrc + '/scss/main.scss',
		watch	: pathSrc + '/scss/**/*.scss',
		dest	: pathDest + '/css'
	},

	js		: {
		src		: pathSrc + '/js/main.js',
		watch	: pathSrc + '/js/**/*.js',
		dest	: pathDest + '/js'
	},

	jsAdmin	: {
		src		: pathSrc + '/js/admin.js',
		watch	: pathSrc + '/js/**/*.js',
		dest	: pathDest + '/js/admin'
	},

	img		: {
		src		: pathSrc + '/img/**/*.{png,jpg,jpeg,gif,svg}',
		watch	: pathSrc + '/img/**/*.{png,jpg,jpeg,gif,svg}',
		dest	: pathDest + '/img'
	},

	del		: {
		clean	: [
			`${pathDest}/*.php`,
			`${pathDest}/js/**/*`,
			`${pathDest}/scss/**/*`,
			`${pathDest}/img/**/*`
		]
	}
};
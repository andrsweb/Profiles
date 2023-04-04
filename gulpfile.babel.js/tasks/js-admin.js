import gulp from 'gulp'

// Plugins.
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import babel from 'gulp-babel'
import webpack from 'webpack-stream'
import rename from 'gulp-rename'

// Config.
import path from '../config/path'
import app from '../config/app'

const jsAdmin = () => {
	return gulp.src( path.jsAdmin.src, { sourcemaps: app.isDev } )
		.pipe( plumber( {
			errorHandler: notify.onError( error => ( {
				title	: 'ERROR IN JAVASCRIPT ADMIN',
				message	: error.message
			} ) )
		} ) )
		.pipe( babel() )
		.pipe( webpack( app.webpack ) )
		.pipe( rename( { basename: 'admin', suffix: '.min' } ) )
		.pipe( gulp.dest( path.jsAdmin.dest, { sourcemaps: app.isDev } ) )
}

export default jsAdmin
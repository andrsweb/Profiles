import gulp from 'gulp'

// Config.
import path from '../config/path'

const php = () => gulp.src( path.php.src ).pipe( gulp.dest( path.php.dest ) )

export default php
import express from 'express';
import createError from 'http-errors';
import path, { join } from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import DB from 'better-sqlite3-helper';

import indexRouter from './routes/index.js';
import tenantRouter from './routes/tenantAuth.route.js';
import oauthRouter from './routes/oauth.route.js';
import tenantRepoRouter from './routes/tenantRepo.route.js';
import repoActivityRouter from './routes/repoActivity.route.js';

import { setDebug, debug } from './src/utils/consoleUtil.js';

const DB_FILE_PATH = './db/wfman.sqlite3.db';

DB({
    path: DB_FILE_PATH, // this is the default
    // memory: false, // create a db only in memory
    readonly: false, // read only
    fileMustExist: false, // throw error if database not exists
    WAL: false, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: {
        // force: false, // production
        // force: 'last',
        table: 'migration',
        migrationsPath: './migrations'
    }
});

DB().queryFirstRow('select * from tenantauth limit 1');

console.log('DB loaded');

const app = express();
const PORT = 8844;
const __dirname = path.resolve();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));
// app.set('view engine', 'html');

console.log('Middleware loaded');

setDebug(true);

app.use('/', indexRouter);
app.use('/oauthToken', oauthRouter);
app.use('/tenants', tenantRouter);
app.use('/tenantRepos', tenantRepoRouter);
app.use('/repoActivities', repoActivityRouter);
console.log('Router Loaded  ');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    debug(err, true);
    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send('error.html');
});

app.listen(PORT, () => {
    console.log('Backend server started on port = ' + PORT);
})
//export default app;

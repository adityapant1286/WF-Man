import express from 'express';
import { debug, highlight } from '../src/utils/consoleUtil.js';
import { OAuthTokenController } from '../src/controllers/oauthToken.controller.js';


const router = express.Router();
const controller = new OAuthTokenController();

router.post('/', (req, res, next) => {
    debug('- POST -');
    debug(req.headers, true);
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);
    highlight('in route')
    controller.newToken(req, res, next);
});

export default router;
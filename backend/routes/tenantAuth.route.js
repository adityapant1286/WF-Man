import express from 'express';
import { debug } from '../src/utils/consoleUtil.js';
import { TenantAuthController } from '../src/controllers/tenantAuth.controller.js';

const router = express.Router();
const controller = new TenantAuthController();

router.get('/', (req, res, next) => {
    debug('- GET - ');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findByQueryParams(req, res, next);

});

router.get('/:id', (req, res, next) => {
    debug('- GET by id -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findById(req, res, next);

});

router.get('/:entityName/entityName', (req, res, next) => {
    debug('- GET by entityName -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findByEntityName(req, res, next);

});

router.post('/', (req, res, next) => {
    debug('- POST - req - start --');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);
    debug('--- req - end ---');

    controller.saveTenants(req, res, next);    
});

router.put('/', (req, res, next) => {
    debug('- PUT -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.update(req, res, next);
    
});

router.delete('/', (req, res, next) => {
    debug('- DELETE -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);
    controller.delete(req, res, next);
    
});

export default router;
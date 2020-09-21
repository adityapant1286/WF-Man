import express from 'express';
import { debug } from '../src/utils/consoleUtil.js';
import { TenantRepoController } from '../src/controllers/tenantRepo.controller.js';

const router = express.Router();
const controller = new TenantRepoController();

router.get('/', (req, res, next) => {
    debug('- GET - ');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    // if present then by status, all otherwise
    controller.findByQueryParams(req, res, next);
});

router.get('/:id', (req, res, next) => {
    debug('- GET by id -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findById(req, res, next);
});

router.get('/:tenantAuthId/tenantAuth', (req, res, next) => {
    debug('- GET by tenantAuthId -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findByTenantAuthId(req, res, next);
});

router.get('/:name/name', (req, res, next) => {
    debug('- GET by name -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findByName(req, res, next);
});

router.post('/', (req, res, next) => {
    debug('- POST -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.save(req, res, next);    
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
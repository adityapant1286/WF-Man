import express from 'express';
import { debug } from '../src/utils/consoleUtil.js';
import { RepoActivityController } from '../src/controllers/repoActivity.controller.js';

const router = express.Router();
const controller = new RepoActivityController();

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

router.get('/:tenantRepoId/tenantRepo', (req, res, next) => {
    debug('- GET by tenantRepoId -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findByTenantRepositoryId(req, res, next);
});

router.get('/:branchName/branchName', (req, res, next) => {
    debug('- GET by branchName -');
    debug(req.params, true);
    debug(req.query, true);
    debug(req.body, true);

    controller.findByBranchName(req, res, next);
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
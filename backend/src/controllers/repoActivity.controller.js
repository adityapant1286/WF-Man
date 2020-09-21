import _ from 'lodash';
import { debug } from '../utils/consoleUtil.js';
import { BaseController } from './base.controller.js';
import { RepoActivityRepository } from '../repositories/RepoActivityRepository.js';
import { DEFAULT_DATA_SIZE } from '../utils/constants.js';


export class RepoActivityController extends BaseController {

    constructor() {
        const repo = new RepoActivityRepository();
        super(repo);
    }

    findByTenantAuthId(req, res, next) {
        debug('RepoActivityController.findByTenantAuthId()');

        const tenantAuthId = req.params.tenantAuthId;
        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);

        this.repository
            .findByTenantAuthId(tenantAuthId, limit, page)
            .then((data) => {
                const respCode = !_.isEmpty(data) > 0 ? 200 : 204;
                return res
                        .status(respCode)
                        .send(data);
            })
            .catch((err) => {
                return res
                        .status(400)
                        .send(err);
            });
    }

    findByTenantRepositoryId(req, res, next) {
        debug('RepoActivityController.findByTenantRepositoryId()');

        const tenantRepoId = req.params.tenantRepoId;
        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);

        this.repository
            .findByTenantRepositoryId(tenantRepoId, limit, page)
            .then((data) => {
                const respCode = !_.isEmpty(data) > 0 ? 200 : 204;
                return res
                        .status(respCode)
                        .send(data);
            })
            .catch((err) => {
                return res
                        .status(400)
                        .send(err);
            });
    }

    findByBranchName(req, res, next) {
        debug('RepoActivityController.findByBranchName()');

        const branchName = req.params.branchName;
        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);

        this.repository
            .findByBranchName(branchName, limit, page)
            .then((data) => {
                const respCode = !_.isEmpty(data) > 0 ? 200 : 204;
                return res
                        .status(respCode)
                        .send(data);
            })
            .catch((err) => {
                return res
                        .status(400)
                        .send(err);
            });
    }

}
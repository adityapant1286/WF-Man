import _ from 'lodash';
import { debug } from '../utils/consoleUtil.js';
import { BaseController } from './base.controller.js';
import { TenantRepoRepository } from '../repositories/TenantRepoRepository.js';

export class TenantRepoController extends BaseController {
    constructor() {
        const repo = new TenantRepoRepository();
        super(repo);        
    }
    
    findByTenantAuthId(req, res, next) {
        debug('TenantRepoController.findByTenantAuthId()');

        const tenantAuthId = req.params.tenantAuthId;        

        this.repository
            .findByTenantAuthId(tenantAuthId)
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

    findByName(req, res, next) {
        debug('TenantRepoController.findByEntityName()');

        const name = req.params.name;

        this.repository
            .findByName(name)
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
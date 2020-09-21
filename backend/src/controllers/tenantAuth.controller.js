import _ from 'lodash';
import axios from 'axios';
import { debug, error, highlight } from '../utils/consoleUtil.js';
import { BaseController } from './base.controller.js';
import { TenantAuthRepository } from '../repositories/TenantAuthRepository.js';
import { DEFAULT_DATA_SIZE, 
    Z_ENTITY_INFO_ENDPOINT } from '../utils/constants.js';


export class TenantAuthController extends BaseController {

    constructor() {
        const repo = new TenantAuthRepository();
        super(repo);        
    }

    saveTenants(req, res, next) {
        
        const body = req.body;
            
        axios.get(
            body.baseUrl + Z_ENTITY_INFO_ENDPOINT,
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + body.token
                }
            }
        ).then((resp) => {
            highlight('entity profile info');
            debug(resp);
            debug(resp.status);
            debug(resp.data, true);
            if (resp.status === 200) {
                const data = resp.data;
                return this.saveData({
                    status: 'Active',
                    entityName: data.tenantName + '(' + data.tenantId + ')',
                    baseUrl: body.baseUrl,
                    clientId: body.clientId,
                    clientSecret: body.clientSecret,
                    locale: data.locale,
                    timezone: data.timeZone
                });
            }
            return new Promise((resolve, reject) => {
                reject(resp);
            });
        })
        .then((resp) => {
            highlight('2nd then');
            debug(resp, true);

            const isInserted = (resp.indexOf('rows inserted') > -1);
            const respMsg = isInserted ? resp.substring(0, 1) + ' tenants added' : resp;

            res
                .status(isInserted ? 200 : 400)
                .send(respMsg);
        })
        .catch((err) => {
            highlight('error');
            error(err, true);
            res.status(400)
                .send(err);
        });

    }

    findByQueryParams(req, res, next) {
        debug('findByQueryParams()');
        debug(req);

        if (req.query && req.query.status) {
            
            this.findByStatus(req, res, next);
    
        } else if (req.query && req.query.baseUrl) {
    
            this.findByBaseUrl(req, res, next);
    
        } else {
    
            this.findAll(req, res, next);
        }    
    
    }

    findAll(req, res, next) {
        debug('findAll()');
        debug(req);

        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);
        const requiredOnly = _.defaultTo(req.query.requiredOnly, true);

        this.repository
            .findAll(limit, page, requiredOnly)
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

    findByStatus(req, res, next) {
        debug('findByStatus()');
        debug(this.repository);

        const status = _.defaultTo(req.query.status, 'Active');
        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);
        const requiredOnly = _.defaultTo(req.query.requiredOnly, true);

        this.repository
            .findByStatus(status, limit, page, requiredOnly)
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

    findByBaseUrl(req, res, next) {
        debug('findByBaseUrl()');
        debug(req);

        const baseUrl = _.defaultTo(req.query.baseUrl, 'https://rest.apisandbox.zuora.com');
        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);
        const requiredOnly = _.defaultTo(req.query.requiredOnly, true);

        this.repository
            .findByBaseUrl(baseUrl, limit, page, requiredOnly)
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

    findById(req, res, next) {
        debug('findById()');
        debug(req);

        const id = req.params.id;        

        const requiredOnly = _.defaultTo(req.query.requiredOnly, true);

        this.repository
            .findById(id, requiredOnly)
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

    findByEntityName(req, res, next) {
        debug('findByEntityName()');
        debug(req);

        const entityName = req.params.entityName;
        const requiredOnly = _.defaultTo(req.query.requiredOnly, true);

        this.repository
            .findById(entityName, requiredOnly)
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
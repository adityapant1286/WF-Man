import _ from 'lodash';
import { debug } from '../utils/consoleUtil.js';
import { DEFAULT_DATA_SIZE } from '../utils/constants.js';

export class BaseController {
    constructor(repo) {
        debug('BaseController.constructor() - args');
        debug(repo);
        this.repository = repo;
    }

    validateRequest(req, res) {
        debug('BaseController.validateRequest()');

        if (_.isEmpty(req.body)) {
            return res
                .status(400)
                .send('Bad Request: Request body is empty');
        }
        let rows = req.body;
        if (!_.isArrayLike(req.body) && _.isPlainObject(req.body)) {
            rows = [req.body];
        }
        return rows;
    }

    save(req, res, next) {
        debug('BaseController.save()');

        const rows = this.validateRequest(req, res);

        this.repository
            .saveRows(rows)
            .then((data) => {

                return res
                        .status(201)
                        .send(data);
            })
            .catch((err) => {
                debug(err);
                return res
                        .status(400)
                        .send(['Error in save operation. Please validate request.']);
            });
    }

    saveData(reqData) {
        let rows = reqData;
        if (!_.isArrayLike(reqData) && _.isPlainObject(reqData)) {
            rows = [reqData];
        }

        return this.repository
                .saveRows(rows);
    }

    update(req, res, next) {
        debug('BaseController.update()');

        const rows = this.validateRequest(req, res);

        this.repository
            .updateRows(rows)
            .then((data) => {
                return res
                        .status(200)
                        .send(data);
            })
            .catch((err) => {

                return res
                        .status(400)
                        .send(['Error in update operation. Please validate request.']);
            });
    }

    delete(req, res, next) {
        debug('BaseController.delete()');

        const deleteType = _.defaultTo(req.query.type, 'soft');

        if (deleteType === 'hard') { // high risk
            
            this.hardDelete(req, res, next);

        } else {

            this.softDelete(req, res, next);
            
        }
    }

    softDelete(req, res, next) {
        debug('BaseController.softDelete()');

        const rows = this.validateRequest(req, res);

        this.repository
            .deleteSoft(rows)
            .then((data) => {
                return res
                        .status(200)
                        .send(data);
            })
            .catch((err) => {

                return res
                        .status(400)
                        .send(['Error in soft delete operation. Please validate request.']);
            });
    }

    hardDelete(req, res, next) {
        debug('BaseController.hardDelete()');

        const rows = this.validateRequest(req, res);

        const acknowledgement = req.query.agree;

        this.repository
            .deleteHard(rows, acknowledgement)
            .then((data) => {
                return res
                        .status(200)
                        .send(data);
            })
            .catch((err) => {

                return res
                        .status(400)
                        .send(['Error in delete operation. Please validate request.']);
            });

    }

    findByQueryParams(req, res, next) {
        debug('BaseController.findByQueryParams()');
        debug(req);

        if (req.query && req.query.status) {
            
            this.findByStatus(req, res, next);
    
        } else {
    
            this.findAll(req, res, next);
        }    
    
    }

    findAll(req, res, next) {
        debug('BaseController.findAll()');

        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);

        this.repository
            .findAll(limit, page)
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
        debug('BaseController.findByStatus()');

        const status = _.defaultTo(req.query.status, 'Active');
        const limit = _.defaultTo(req.query.limit, DEFAULT_DATA_SIZE.LIMIT);
        const page = _.defaultTo(req.query.page, DEFAULT_DATA_SIZE.PAGE);
        
        

        this.repository
            .findByStatus(status, limit, page)
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
        debug('BaseController.findById()');

        const id = req.params.id;        

        this.repository
            .findById(id)
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
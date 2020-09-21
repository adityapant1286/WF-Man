import { highlight, debug, error } from "../utils/consoleUtil.js";
import DB from "better-sqlite3-helper";
import { TENANTAUTH_SQL, TABLES, limitAndOffset } from "../utils/sqlUtil.js";
import bPromise from 'bluebird';


export class TenantAuthRepository {
    constructor() {}

    /**
     * Create a new table.
     * This operation always drops the existing table.
     * 
     * @param {boolean} drop 
     * @returns Promise
     */
/*     
    createTable(drop = true) {
        return new bPromise((resolve, reject) => {
            try {

                if (drop) {
                    this._dropTable();
                }

                const res = DB().run(TENANTAUTH_SQL.CREATE_TABLE);
                highlight("createTable()");
                debug(res, true);

                resolve(TABLES.TENANTAUTH + ' table Created');

            } catch (err) {
                reject(err);
            }
        });
    }
 */

     /**
     * Inserts multiple rows.
     * Each row should contain following fields
     * (entityName, baseUrl, clientId, clientSecret, status)
     * 
     * @param {Array} rows
     * @returns Promise
     */
    saveRows(rows = []) {
        highlight('insertRows() - ' + rows.length);

        return new bPromise((resolve, reject) => {
            try {

                DB().insert(TABLES.TENANTAUTH, rows);

                const msg = rows.length + ' rows inserted.';
                debug(msg);

                resolve(msg);

            } catch (err) {
                highlight('saveRows - error');
                error(err);
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * Updates multiple rows by id or clientId.
     * (id, entityName, baseUrl, clientId, clientSecret, status, updatedate)
     * 
     * Following fields will be ignored for update operation.
     * ['id', 'entityName']
     * 
     * @param {Array} rows - array of rows to be updated
     * 
     * 
     * @returns Promise
     */
    updateRows(rows = []) {
        highlight('updateRows() - ' + rows.length);

        return new bPromise((resolve, reject) => {
            try {
                const db = DB();
                let changedRow = 0;

                rows.forEach(rows, (row) => {
                    changedRow += db.updateWithBlackList(
                        TABLES.TENANTAUTH,
                        row,
                        ['id = ? or clientId = ?', row.id, row.clientId],
                        ['id', 'entityName']
                    );
                });

                const msg = changedRow + ' rows updated.';
                debug(msg);

                resolve(msg);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * This will expire the records for the ids received in input.
     * 
     * @param {Array} rows - array of ids to be soft delete
     * @returns Promise
     */
    deleteSoft(rows = []) {
        highlight('deleteSoft() - ' + rows.length);

        rows = rows.map((row) => {
            row['status'] = 'Expired';
            return row;
        });

        return this.updateRows(rows);
    }

    /**
     * Deletes the records from the database by id or clientId
     * 
     * This operation can not be undone, therefore please use deleteSoft() instead.
     * 
     * @param {Array} rows - array of ids to be deleted
     * @param {boolean} agreement - User acceptance agreement. 
     * 
     * Records will be deleted only if this value is true.
     * 
     * @returns Promise
     */
    deleteHard(rows = [], agreement = false) {
        highlight('deleteHard()' + rows);

        return new bPromise((resolve, reject) => {

            if (!agreement) {
                reject('Please accept user agreement before delete.');
            }
            try {
                const db = DB();
                let changedRow = 0;

                rows.forEach((row) => {
                    changedRow += db.delete(
                        TABLES.TENANTAUTH, ['id = ? or clientId = ?', row.id, row.clientId]
                    );
                });
                const msg = changedRow + ' rows deleted.';

                debug(msg);
                resolve(msg);

            } catch (err) {
                error(err);
                reject(err);
            }
        });
    }

    /**
     * Retrieves all the records from the table.
     * This function can also be used for pagination as follows.

     * This operation by default hides sensitive data returning to the caller. 
     * If necessary please pass requiredOnly=false to return all data.
     * 
     * - limit = 5 -> this will fetch first 5 rows.
     * 
     * - limit = 5 and page 2 -> this will fetch 5 rows from 6-10.
     * 
     * - limit = 5 and page 3 -> this will fetch 5 rows from 11-15.
     * 
     * - limit = 5 and page 10 -> this will fetch 5 rows from 46-50.
     * 
     * 
     * @param {number} limit - number of rows to be fetched (default 0 = all rows)
     * @param {number} page - the page number of set of rows (default 1).
     *                        If the limit is 0 then the page number is ignored
     * @param {boolean} requiredOnly - if true, this excludes sensitive information.
     *                                  if false, fetches all information.
     * @returns Promise
     */
    findAll(limit = 0, page = 1, requiredOnly = true) {
        highlight('findAll()');

        const qry = requiredOnly
            ? TENANTAUTH_SQL.SELECT_ALL.replace('clientSecret, ', '')
            : TENANTAUTH_SQL.SELECT_ALL;

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(                    
                    qry + limitAndOffset(limit, page)
                    
                );
                debug(results.length + ' rows retrieved.');

                resolve(results);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * Retrieves a record by record id.
     * 
     * @param {number} id - entity id to search for
     * @param {boolean} requiredOnly - if true, this excludes sensitive information.
     *                                  if false, fetches all information.
     * @returns Promise
     */
    findById(id, requiredOnly = true) {
        highlight('findById()');

        const qry = requiredOnly
            ? TENANTAUTH_SQL.SELECT_BY_ID.replace('clientSecret, ', '')
            : TENANTAUTH_SQL.SELECT_BY_ID;

        return new bPromise((resolve, reject) => {
            try {

                const result = DB().queryFirstRow(qry, [id]);
                debug('recordId = ' + result.id);

                resolve(result);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * Retrieves a record by entity name.
     * 
     * @param {string} entityName - entity name to search for
     * @param {boolean} requiredOnly - if true, this excludes sensitive information.
     *                                  if false, fetches all information.
     * @returns Promise
     */
    findByEntityName(entityName, requiredOnly = true) {
        highlight('findByEntityName()');

        const qry = requiredOnly
            ? TENANTAUTH_SQL.SELECT_BY_ENTITYNAME.replace('clientSecret, ', '')
            : TENANTAUTH_SQL.SELECT_BY_ENTITYNAME;

        return new bPromise((resolve, reject) => {
            try {

                const result = DB().queryFirstRow(qry, [entityName]);
                debug('recordId = ' + result.id + ', entityName = ' + result.entityName);

                resolve(result);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * Retrieves all the records from the table by status field.
     * This function can also be used for pagination as follows.

     * This operation by default hides sensitive data returning to the caller. 
     * If necessary please pass requiredOnly=false to return all data.
     * 
     * - limit = 5 -> this will fetch first 5 rows.
     * 
     * - limit = 5 and page 2 -> this will fetch 5 rows from 6-10.
     * 
     * - limit = 5 and page 3 -> this will fetch 5 rows from 11-15.
     * 
     * - limit = 5 and page 10 -> this will fetch 5 rows from 46-50.
     * 
     * 
     * @param {string} status - retrieve rows matches with this status
     * @param {number} limit - number of rows to be fetched (default 0 = all rows)
     * @param {number} page - the page number of set of rows (default 1).
     *                        If the limit is 0 then the page number is ignored
     * @param {boolean} requiredOnly - if true, this excludes sensitive information.
     *                                  if false, fetches all information.
     * @returns Promise
     */
    findByStatus(status = 'Active', limit = 0, page = 1, requiredOnly = true) {
        highlight('findByStatus(' + status + ')');

        const qry = requiredOnly
            ? TENANTAUTH_SQL.SELECT_BY_STATUS.replace('clientSecret, ', '')
            : TENANTAUTH_SQL.SELECT_BY_STATUS;

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(
                    qry + limitAndOffset(limit, page),
                    [status]
                );
                debug(results.length + ' rows retrieved.');

                resolve(results);

            } catch (err) {                
                error(err);                
                reject(err);
            }
        });
    }

    /**
     * Retrieves all the records from the table by baseUrl field.
     * This function can also be used for pagination as follows.

     * This operation by default hides sensitive data returning to the caller. 
     * If necessary please pass requiredOnly=false to return all data.
     * 
     * - limit = 5 -> this will fetch first 5 rows.
     * 
     * - limit = 5 and page 2 -> this will fetch 5 rows from 6-10.
     * 
     * - limit = 5 and page 3 -> this will fetch 5 rows from 11-15.
     * 
     * - limit = 5 and page 10 -> this will fetch 5 rows from 46-50.
     * 
     * 
     * @param {string} baseUrl - retrieves records which matches with the baseUrl
     * @param {number} limit - number of rows to be fetched (default 0 = all rows)
     * @param {number} page - the page number of set of rows (default 1).
     *                        If the limit is 0 then the page number is ignored
     * @param {boolean} requiredOnly - if true, this excludes sensitive information.
     *                                  if false, fetches all information.
     * @returns Promise
     */
    findByBaseUrl(baseUrl = 'https://rest.apisandbox.zuora.com', limit = 0, page = 1, requiredOnly = true) {
        highlight('findByBaseUrl(' + status + ')');

        const qry = requiredOnly
            ? TENANTAUTH_SQL.SELECT_BY_BASEURL.replace('clientSecret, ', '')
            : TENANTAUTH_SQL.SELECT_BY_BASEURL;

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(
                    qry + limitAndOffset(limit, page),
                    [baseUrl]
                );
                debug(results.length + ' rows retrieved.');

                resolve(results);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

}
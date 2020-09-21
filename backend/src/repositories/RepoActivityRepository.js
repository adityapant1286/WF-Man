import { highlight, debug, error } from "../utils/consoleUtil.js";
import DB from "better-sqlite3-helper";
import { TABLES, limitAndOffset, REPOACTIVITY_SQL } from "../utils/sqlUtil.js";
import bPromise from 'bluebird';


export class RepoActivityRepository {
    constructor() {}

    /**
     * Inserts multiple rows.
     * Each row should contain following fields
     * (tenantAuthId, tenantRepositoryId, branchName, branch, comments, status) 
     * 
     * @param {Array} rows
     * @returns Promise
     */
    saveRows(rows = []) {
        highlight('insertRows() - ' + rows.length);

        return new bPromise((resolve, reject) => {
            try {

                DB().insert(TABLES.REPOACTIVITY, rows);

                const msg = rows.length + ' rows inserted.';
                debug(msg);

                resolve(msg);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * Updates multiple rows by id or tenantAuthId or tenantRepositoryId.
     * (id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status)  
     * 
     * Following fields will be ignored for update operation.
     * [id, tenantAuthid, tenantRepositoryId]
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
                        TABLES.REPOACTIVITY,
                        row,
                        ['id = ? or tenantAuthId = ? or tenantRepositoryId = ?', 
                            row.id, row.tenantAuthId, row.tenantRepositoryId],
                        ['id', 'tenantAuthId', 'tenantRepositoryId']
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
     * Deletes the records from the database by id or tenantAuthId or tenantRepositoryId.
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
                    changedRow += db.delete(TABLES.REPOACTIVITY, 
                        ['id = ? or tenantAuthId = ? or tenantRepositoryId = ?', 
                            row.id, row.tenantAuthId, row.tenantRepositoryId]);
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
     * @returns Promise
     */
    findAll(limit = 0, page = 1) {
        highlight('findAll()');

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(                    
                    REPOACTIVITY_SQL.SELECT_ALL + limitAndOffset(limit, page)                    
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
     * @param {number} id - record id to search for
     * @returns Promise
     */
    findById(id) {
        highlight('findById()');

        return new bPromise((resolve, reject) => {
            try {

                const result = DB().queryFirstRow(REPOACTIVITY_SQL.SELECT_BY_ID, [id]);
                debug('recordId = ' + result.id + 
                ', tenantRepositoryId = ' + result.tenantRepositoryId + 
                ', tenantAuthId = ' + result.tenantAuthId);

                resolve(result);

            } catch (err) {
                error(err, true);
                reject(err);
            }
        });
    }

    /**
     * Retrieves all the records by tenant auth id.
     * This function can also be used for pagination as follows.
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
     * @param {number} tenantAuthId - tenant auth id to search for
     * @param {number} limit - number of rows to be fetched (default 0 = all rows)
     * @param {number} page - the page number of set of rows (default 1).
     *                        If the limit is 0 then the page number is ignored
     * @returns Promise
     */
    findByTenantAuthId(tenantAuthId, limit = 0, page = 1) {
        highlight('findByTenantAuthId()');

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(
                    REPOACTIVITY_SQL.SELECT_BY_TENANTAUTHID + limitAndOffset(limit, page), 
                    [tenantAuthId]
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
     * Retrieves all the records by tenant Repository Id.
     * This function can also be used for pagination as follows.
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
     * @param {number} tenantRepositoryId - tenant Repository Id to search for
     * @param {number} limit - number of rows to be fetched (default 0 = all rows)
     * @param {number} page - the page number of set of rows (default 1).
     *                        If the limit is 0 then the page number is ignored
     * @returns Promise
     */
    findByTenantRepositoryId(tenantRepositoryId, limit = 0, page = 1) {
        highlight('findByTenantRepositoryId()');

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(
                    REPOACTIVITY_SQL.SELECT_BY_TENANTREPOSITORYID + limitAndOffset(limit, page), 
                    [tenantRepositoryId]
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
     * Retrieves all the records by branch Name.
     * This function can also be used for pagination as follows.
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
     * @param {number} branchName - branch Name to search for
     * @param {number} limit - number of rows to be fetched (default 0 = all rows)
     * @param {number} page - the page number of set of rows (default 1).
     *                        If the limit is 0 then the page number is ignored
     * @returns Promise
     */
    findByBranchName(branchName, limit = 0, page = 1) {
        highlight('findByBranchName()');

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(
                    REPOACTIVITY_SQL.SELECT_BY_BRANCHNAME + limitAndOffset(limit, page), 
                    [branchName]
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
     * Retrieves all the records from the table by status field.
     * This function can also be used for pagination as follows.

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
     * @returns Promise
     */
    findByStatus(status = 'Active', limit = 0, page = 1) {
        highlight('findByStatus(' + status + ')');

        return new bPromise((resolve, reject) => {
            try {

                const results = DB().query(
                    REPOACTIVITY_SQL.SELECT_BY_STATUS + limitAndOffset(limit, page),
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
}

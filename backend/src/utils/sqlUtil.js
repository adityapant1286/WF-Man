import { DEFAULT_DATA_SIZE } from "./constants.js";


const _dropTable = (tablename) => ["DROP TABLE IF EXISTS ", tablename].join("");

export const limitAndOffset = (limit = DEFAULT_DATA_SIZE.LIMIT, 
                                page = DEFAULT_DATA_SIZE.PAGE) => {
    const offset = (page === 1) ? 0 : ((page - 1) * limit);
    return limit > 0
        ? (' LIMIT ' + limit + ' OFFSET ' + offset)
        : '';
};


export const TABLES = {
    TENANTAUTH: "tenantauth",
    TENANTREPOSITORY: "tenantrepository",
    REPOACTIVITY: "repoactivity"
};

export const TENANTAUTH_SQL = {    
    SELECT_ALL: [
        "SELECT id, entityName, baseUrl, clientId, clientSecret, status, updateDate FROM ",
        TABLES.TENANTAUTH
    ].join(""),
    SELECT_BY_ID: [
        "SELECT id, entityName, baseUrl, clientId, clientSecret, status, updateDate FROM ",
        TABLES.TENANTAUTH,
        " WHERE id = ?"
    ].join(""),
    SELECT_BY_ENTITYNAME: [
        "SELECT id, entityName, baseUrl, clientId, clientSecret, status, updateDate FROM ",
        TABLES.TENANTAUTH,
        " WHERE entityname = ?"
    ].join(""),
    SELECT_BY_STATUS: [
        "SELECT id, entityName, baseUrl, clientId, clientSecret, status, updateDate FROM ",
        TABLES.TENANTAUTH,
        " WHERE status = ?"
    ].join(""),
    SELECT_BY_BASEURL: [
        "SELECT id, entityName, baseUrl, clientId, clientSecret, status, updateDate FROM ",
        TABLES.TENANTAUTH,
        " WHERE baseUrl = ?"
    ].join("")
};


export const TENANTREPOSITORY_SQL = {
    SELECT_ALL: [
        "SELECT id, tenantAuthId, name, accessToken, scopes, repoType, masterBranch, status, updateDate FROM ",
        TABLES.TENANTREPOSITORY
    ].join(""),
    SELECT_BY_ID: [
        "SELECT id, tenantAuthId, name, accessToken, scopes, repoType, masterBranch, status, updateDate FROM ",
        TABLES.TENANTREPOSITORY,
        " WHERE id = ?"
    ].join(""),
    SELECT_BY_TENANTAUTHID: [
        "SELECT id, tenantAuthId, name, accessToken, scopes, repoType, masterBranch, status, updateDate FROM ",
        TABLES.TENANTREPOSITORY,
        " WHERE tenantAuthId = ?"
    ].join(""),
    SELECT_BY_NAME: [
        "SELECT id, tenantAuthId, name, accessToken, scopes, repoType, masterBranch, status, updateDate FROM ",
        TABLES.TENANTREPOSITORY,
        " WHERE name = ?"
    ].join(""),
    SELECT_BY_STATUS: [
        "SELECT id, tenantAuthId, name, accessToken, scopes, repoType, masterBranch, status, updateDate FROM ",
        TABLES.TENANTREPOSITORY,
        " WHERE status = ?"
    ].join("")
};


export const REPOACTIVITY_SQL = {
    SELECT_ALL: [
        "SELECT id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status, updateDate FROM ",
        TABLES.REPOACTIVITY
    ].join(""),
    SELECT_BY_ID: [
        "SELECT id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status, updateDate FROM ",
        TABLES.REPOACTIVITY,
        " WHERE id = ?"
    ].join(""),
    SELECT_BY_TENANTAUTHID: [
        "SELECT id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status, updateDate FROM ",
        TABLES.REPOACTIVITY,
        " WHERE tenantAuthId = ?"
    ].join(""),
    SELECT_BY_TENANTREPOSITORYID: [
        "SELECT id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status, updateDate FROM ",
        TABLES.REPOACTIVITY,
        " WHERE tenantRepositoryId = ?"
    ].join(""),
    SELECT_BY_BRANCHNAME: [
        "SELECT id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status, updateDate FROM ",
        TABLES.REPOACTIVITY,
        " WHERE branchName = ?"
    ].join(""),
    SELECT_BY_STATUS: [
        "SELECT id, tenantAuthId, tenantRepositoryId, branchName, branch, comments, status, updateDate FROM ",
        TABLES.REPOACTIVITY,
        " WHERE status = ?"
    ].join("")
};


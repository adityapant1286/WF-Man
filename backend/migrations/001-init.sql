-- Up 
CREATE TABLE `tenantauth` (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entityName TEXT NOT NULL,
    baseUrl TEXT NOT NULL,
    clientId TEXT NOT NULL,
    clientSecret TEXT NOT NULL,
    locale TEXT NOT NULL,
    timezone TEXT NOT NULL,
    status TEXT NOT NULL,
    updateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `tenantrepository` (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tenantAuthId INTEGER NOT NULL,
    accessToken TEXT,
    scopes TEXT,
    repoType TEXT DEFAULT 'GitHub',
    masterBranch TEXT,
    status TEXT NOT NULL,
    updateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenantrepository_fk_tenantauthid FOREIGN KEY (tenantAuthId) 
    REFERENCES `tenantauth` (id) ON UPDATE CASCADE ON DELETE CASCADE
);
 
CREATE TABLE `repoactivity` (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenantRepositoryId INTEGER NOT NULL,
    tenantAuthId INTEGER NOT NULL,
    branchName TEXT,
    branch TEXT,
    comments TEXT,
    status TEXT NOT NULL,
    updateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT repoactivity_fk_tenantauthid FOREIGN KEY (tenantAuthId) 
    REFERENCES `tenantauth` (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT repoactivity_fk_tenantrepositoryid FOREIGN KEY (tenantRepositoryId) 
    REFERENCES `tenantrepository` (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX tenantrepository_index_tenantauthid ON `tenantrepository` (tenantAuthId);
CREATE INDEX repoactivity_index_tenantrepositoryid ON `repoactivity` (tenantRepositoryId);
CREATE INDEX repoactivity_index_tenantauthid ON `repoactivity` (tenantAuthId);
 
-- Down 
DROP TABLE IF EXISTS `tenantauth`;
DROP TABLE IF EXISTS `tenantrepository`;
DROP TABLE IF EXISTS `repoactivity`;

DROP INDEX tenantrepository_index_tenantauthid;
DROP INDEX repoactivity_index_tenantrepositoryid;
DROP INDEX repoactivity_index_tenantauthid;
    


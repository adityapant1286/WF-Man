import qs from 'qs';
import axios from 'axios';

import { debug } from '../utils/consoleUtil.js';
import { Z_GRANT_TYPE, Z_OAUTH_ENDPOINT } from '../utils/constants.js';
import { OAuth } from '../models/OAuth.js';

export class OAuthService {

    constructor() {
        this.oauthObj = new OAuth();
    }

    baseUrl(baseUrl) {
        this.oauthObj.baseUrl = baseUrl;
        return this;
    }

    clientId(clientId) {
        this.oauthObj.clientId = clientId;
        return this;
    }

    clientSecret(clientSecret) {
        this.oauthObj.clientSecret = clientSecret;
        return this;
    }

    generateToken() {
        const endpoint = this.oauthObj.baseUrl + Z_OAUTH_ENDPOINT;
        const dh = this._dataAndHeaders();

        debug(this.oauthObj.baseUrl);
        debug(this.oauthObj.clientId);

        return axios.post(endpoint, dh.data, dh.headers);
    }

    _dataAndHeaders() {

        const form = {
            client_id: this.oauthObj.clientId,
            client_secret: this.oauthObj.clientSecret,
            grant_type: Z_GRANT_TYPE
        }
        const formData = qs.stringify(form);

        return {
            headers: {
                'Content-Length': formData.length,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            data: formData
        };
    }
}
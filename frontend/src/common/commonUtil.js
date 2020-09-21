import _ from 'lodash';
import axios from 'axios';
import { BK_HOST, BK_ENDPOINTS, REQ_HEADERS } from './constants.js';

export const isAllEmpty = (...v) => {
    let _arr = v;
    if (!_.isArray(v)) {
        _arr = [v];
    }

    const _res = _arr.filter((e) => !_.isEmpty(e));

    return _res.length === 0;
};

export const isAnyEmpty = (...v) => {
    let _arr = v;
    if (!_.isArray(v)) {
        _arr = [v];
    }    

    for (let i = 0; i < _arr.length; i++) {
        if (_.isEmpty(_arr[i])) {
            return true;
        }
    }

    return false;

};

/**
 *  {
 *      apiHost: '',
 *      clientId: '',
 *      clientSecret: ''
 *  }
 * 
 * @param {Object} inputData the object will be used to generate OAuth token
 * @returns { resp, isAuthError}
 */
export const getAccessToken = async (inputData) => {
    try {
        const resp = await axios.post(
                        BK_HOST + BK_ENDPOINTS.OAUTH, 
                        {
                            baseUrl: inputData.apiHost,
                            client_id: inputData.clientId,
                            client_secret: inputData.clientSecret
                        },
                        { headers: REQ_HEADERS.DEFAULT }
                    );
        return resp;

    } catch(err) {
        return err;
    }
};

/**
 *  Refer https://github.com/axios/axios#handling-errors
 * 
 * @param {*} err exception object from catch block
 * @param {*} onResponse callback function to handle error response
 * @param {*} onMessage callback function to handle error message
 * @param {*} onRequest callback function to handle error request
 */
export const handleAxiosError = (err, onResponse, onMessage, onRequest) => {
    if (err.response && onResponse) {
        onResponse(err.response);
    } else if (err.request && onRequest) {
        onRequest(err.request);
    } else if (onMessage) {
        onMessage(err.message)
    }
};

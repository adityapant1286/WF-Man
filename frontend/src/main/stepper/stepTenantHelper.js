import axios from 'axios';
import { BK_HOST, 
    BK_ENDPOINTS} from '../../common/constants.js';

/**
 * 
 * @param {*} oauthData oauth response data
 * @param {*} inputData user input data
 */
export const saveToBackend = async (oauthData, inputData) => {
    try {
        const resp = await axios.post(
            BK_HOST + BK_ENDPOINTS.TENANTS,
            {
                baseUrl: inputData.apiHost,
                token: oauthData.access_token,
                clientId: inputData.clientId,
                clientSecret: inputData.clientSecret
            }
        );
        return resp;    
    } catch(err) {
        return err;
    }
};
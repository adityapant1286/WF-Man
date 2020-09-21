import _ from 'lodash';

import { debug, highlight } from '../utils/consoleUtil.js';
import { isAnyEmpty } from '../utils/commonUtil.js';
import { OAuthService } from '../services/oauth.service.js';


export class OAuthTokenController {

    constructor() {
        this.service = new OAuthService();
    }

    newToken(req, res, next) {

        const body = req.body;

        if (_.isEmpty(body)) {
            return res.status(400)
                        .send("Missing OAuth configurations in the request body.");
        }

        if (isAnyEmpty(body.baseUrl, body.client_id, body.client_secret)) {

            return res.status(400)
                        .send("Missing OAuth configurations in the request body. Required fields empty: baseUrl, client_id, client_secret.");

        }

        this.service
            .baseUrl(body.baseUrl)
            .clientId(body.client_id)
            .clientSecret(body.client_secret)
            .generateToken()
            .then((oaResp) => {
                highlight('token resp');
                debug(oaResp.status);
                
                if (oaResp.status === 200) {
                    debug(oaResp.data, true);

                    res.status(200).send({
                        'baseUrl': body.baseUrl,
                        'access_token': oaResp.data.access_token,
                        'token_type': oaResp.data.token_type,
                        'expires_in': oaResp.data.expires_in,
                        'scope': oaResp.data.scope,
                        'jti': oaResp.data.jti
                    });
                } else {
                    res.status(oaResp.status)
                        .send(oaResp);
                }
            })
            .catch((err) => {                
                highlight();
                debug(err.message);               
                
                res.status(401)
                    .send(err.message);
            });
    }
}
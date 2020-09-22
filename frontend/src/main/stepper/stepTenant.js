import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/VisibilityRounded';
import VisibilityOff from '@material-ui/icons/VisibilityOffRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import '../../theme/commonStyle.css';
import { BK_HOST, 
    BK_ENDPOINTS, 
    REQ_HEADERS } from '../../common/constants.js';
import { errorLog, 
    debugLog } from '../../common/consoleUtil.js';
import { errorToast, successToast } from '../../common/tostifyService';
import { isAnyEmpty, 
    handleAxiosError, 
    getAccessToken } from '../../common/commonUtil';
import { saveToBackend } from './stepTenantHelper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        color: theme.palette.text.primary
    },
    grid: {
        marginTop: theme.spacing(2)
    },
    buttonSpinnerWrapper: {
        position: "relative"
    },
    buttonSpinner: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12
    },
    button: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        textTransform: "none"
    }    
}));

const _hosts = [    
    {
        value: "https://rest.apisandbox.zuora.com",
        label: "US-Sandbox"
    },
    {
        value: "https://rest.zuora.com",
        label: "US-Production"
    },
    {
        value: "https://rest.sandbox.eu.zuora.com",
        label: "EU-Sandbox"
    },
    {
        value: "https://rest.eu.zuora.com",
        label: "EU-Production"
    }
];

const _buildKey = (obj) => { return [obj.id, obj.clientId].join('-'); }

const StepTenant = (props) => {
    const classes = useStyles();
 
    const [existingTenantError, setExistingTenantError] = useState(null);
    const [showSecret, setShowSecret] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [addNew, setAddNew] = useState(false);
    const [authenticating, setAuthenticating] = useState(false);
    const [tenants, setTenants] = useState([]);
    
    useEffect(() => {
        _getExistingTenants();
    }, []);

    const _handleApiHost = (e) => {
        const input = e.target.value;
        if (_.isEmpty(input)) {
            return;
        }
        props.handleState('step0', {
            ...props.values.step0,
            apiHost: input
        });
    };

    const _handleSrcTenant = (e) => {
        const input = e.target.value;
        debugLog(input);
        if (_.isEmpty(input)) {
            return;
        }
        props.handleState('step0', {
            ...props.values.step0,
            existingSourceTenant: input
        });
    };

    const _handleClientId = (e) => {
        const input = e.target.value;
        if (_.isEmpty(input)) {            
            return;
        }
        props.handleState('step0', {
            ...props.values.step0,
            clientId: input
        });
    };

    const _handleClientSecret = (e) => {
        const input = e.target.value;
        if (_.isEmpty(input)) {            
            return;
        }
        props.handleState('step0', {
            ...props.values.step0,
            clientSecret: input
        });
    };

    const _handleShowSecret = (e) => {
        setShowSecret(!showSecret);
    };

    const _handleMouseDownSecret = (e) => {
        e.preventDefault();
    };

    const _handleAuthenticate = () => {
        const inputData = props.values.step0;
        if (!_.isEmpty(inputData.existingSourceTenant) 
            && !isAnyEmpty(inputData.clientId, inputData.clientSecret)) {
            errorToast('Validation Error', 'Either you can add a new source tenant or select existing');
            return;
        }

        if (isAnyEmpty(inputData.clientId, inputData.clientSecret, inputData.apiHost)) {
            errorToast('Validation Error', 'Client ID, Client Secret, API Host are required fields');
            return;
        }
        debugLog(inputData, true);

        _addTenant(inputData);
    };

    const _handleAddNew = () => {
        props.handleState('step0', {
            ...props.values.step0,
            apiHost: '',
            clientId: '',
            clientSecret: ''
        });

        setAddNew(true);
    };

    const _handleAddNewCancel = () => {
        setAddNew(false);
    };

    const existingTenantsComponent = () => {
        return existingTenantError 
            ?  ''
            : !isLoaded 
                ? <div>Loading...</div> 
                : !_.isEmpty(tenants) && !addNew
                    ? (
                        <Grid container direction="column" >
                            <Grid item xs className={classes.grid}>
                                <TextField select id="idTenantsSelect"
                                            label="Source Tenants"
                                            onChange={_handleSrcTenant}
                                            helperText="Select existing or add new" 
                                            defaultValue={props.values.step0.existingSourceTenant || ''}
                                            value={props.values.step0.existingSourceTenant || ''}
                                            >
                                    {
                                        tenants.map((obj) => (
                                            <MenuItem key={obj.entityName} value={_buildKey(obj)}>
                                                {obj.entityName}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                    )
                    : ''
    };

    const addNewTenantComponent = () => {
        
        return (            
            <Grid container direction="column">
                <Grid container 
                    className={(!addNew) 
                                ? "show-it" 
                                : "hide-it"}>
                    <Grid item xs className={classes.grid}>
                        <Button variant="contained" 
                                        color="primary" 
                                        size="small"                                
                                        className={classes.button}
                                        onClick={_handleAddNew}
                                        >Add</Button>
                    </Grid>
                </Grid>
                <Grid container 
                    className={(addNew) 
                                ? "show-step-tenant-input" 
                                : "hide-step-tenant-input"}>
                    {/* Client Id */}
                    <Grid item xs className={classes.grid}>
                        <TextField fullWidth required id="idClientIdInput" 
                                label="Client ID" onBlur={_handleClientId}
                                defaultValue={props.values.step0.clientId}
                                // helperText="Enter OAuth Client ID" 
                                />
                    </Grid>
                    {/* Client Secret */}
                    <Grid item xs className={classes.grid}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="idAdornmentClientSecret">Client Secret</InputLabel>
                            <Input id="idAdornmentClientSecret"
                                type={showSecret ? 'text' : 'password'}
                                defaultValue={props.values.step0.clientSecret}
                                autoComplete="off"
                                onBlur={_handleClientSecret}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton aria-label="Toggle visibility"
                                        onClick={_handleShowSecret}
                                        onMouseDown={_handleMouseDownSecret}
                                        >
                                            {showSecret ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                    {/* API Host or baseUrl */}
                    <Grid item xs className={classes.grid}>
                        <TextField fullWidth required select
                                id="idAPIHostSelect"
                                label="API Host"
                                onChange={_handleApiHost}
                                defaultValue={props.values.step0.apiHost || ''}
                                value={props.values.step0.apiHost || ''}
                                >                                
                            {
                                _hosts.map((option) => (
                                    <MenuItem key={option.label} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>
                    {/* Authenticate button */}
                    <Grid item xs >
                        <div className={classes.buttonSpinnerWrapper}>
                            <Button variant="contained" 
                                    color="primary" 
                                    size="small"
                                    disabled={authenticating}
                                    className={classes.button}
                                    onClick={_handleAuthenticate}
                                    >
                                Authenticate
                                {
                                    authenticating && 
                                    (<CircularProgress size={24} 
                                        className={classes.buttonSpinner} 
                                        color="primary"/>)
                                }
                            </Button>
                            <Button size="small" onClick={_handleAddNewCancel} className={classes.button}>
                                Cancel
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const _addTenant = async (inputData) => {
        if (!authenticating) {

            setAuthenticating(true);
            const oauth = await getAccessToken(inputData);
            debugLog(oauth.status);
            const oauthData = oauth.data;

            if (oauth.status === 200) {
                // debugLog(oauthData, true);

                const backendResp = await saveToBackend(oauthData, inputData);

                debugLog('add tenant resp');
                debugLog(backendResp, true);

                if (backendResp.status === 200) {
                    setAddNew(false); // hide the component
                    _getExistingTenants();                    
                    successToast('Success', backendResp.data);                    
                } else {
                    handleAxiosError(backendResp,
                        (res) => {
                            errorToast('Data Save Error', res.data);
                        }
                    );                    
                }

            } else {
                handleAxiosError(oauth, 
                    (res) => {
                    debugLog('error response');
                    debugLog(res.status);
                    let errMsg = res.data;
                    if (res.status === 401) {
                        errMsg = 'Unauthorised user. Please check credentials and the user has permissions.';
                    }
                    errorToast('Authentication Error', errMsg);
                });
            }
            setAuthenticating(false);
        }        
    };    

    const _getExistingTenants = () => {
        axios.get(BK_HOST + BK_ENDPOINTS.TENANTS, {
            params: {
                status: 'Active'
            },
            headers: REQ_HEADERS.DEFAULT
        })
        .then((resp) => {  
            debugLog(resp.status);
            if (resp.status === 200) {
                setTenants(resp.data);                
            }
            setIsLoaded(true);
        })        
        .catch((err) => {            
            errorLog(err);
            setIsLoaded(true);
            setExistingTenantError(err);
        });
    };

    return (
        <form>            
            {existingTenantsComponent()}
            {addNewTenantComponent()}                            
        </form>
    );
};

export default StepTenant;
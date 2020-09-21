import { useSnackbar } from 'notistack';
import React from 'react';

let useSnackbarRef;
const snackbarRef = (useSnackbarRefProp) => {
    useSnackbarRef = useSnackbarRefProp;
};

const InnerConfigurator = (props) => {
    props.snackbarRef(useSnackbar());
    return null;
};

export const SnackbarServiceConfigurator = () => {
    return <InnerConfigurator snackbarRef={snackbarRef} />
};

export default {
    _toast(msg = 'test', type = 'default', json=false, ...props) {
        useSnackbarRef.enqueueSnackbar(
            (json ? JSON.stringify(msg, null, 2) : msg), 
            {
                variant: type,
                ...props
            }
        );
    },
    success(msg, json=false, ...props) {
        this._toast(msg, 'success', json, props);
    },
    warning(msg, json=false, ...props) {
        this._toast(msg, 'warning', json, props);
    },
    info(msg, json=false, ...props) {
        this._toast(msg, 'info', json, props);
    },
    error(msg, json=false, ...props) {
        this._toast(msg, 'error', json, props);
    }    
};
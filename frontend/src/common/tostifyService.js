import React from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import '../theme/tostifyStyle.css';

const ToastMsg = (props) => {
    const stringify = (props.isJson || _.isPlainObject(props.body))
    return (
        <div>
            <div className="toastHeader">{props.header}</div>
            {
                stringify
                ? <pre>{JSON.stringify(props.body, null, 2)}</pre>
                : <p>{props.body}</p>
            }
        </div>
    );
    }

const defaultOptions = {
    type: toast.TYPE.DEFAULT
};

let defaultObject = {
    options: defaultOptions,
    header: 'Hello',
    body: 'World',
    json: false
};

export const showToastByObj = (obj = defaultObject) => {
    toast(
        <ToastMsg header={obj.header} body={obj.body} isJson={obj.json} />, 
        obj.options
    );
};

const showToastByType = (toastType = toast.TYPE.DEFAULT, heading = '', msg = '', isJson = false) => {
    defaultOptions['type'] = toastType;
    showToastByObj({
        options: defaultOptions,
        header: heading,
        body: msg,
        json: isJson
    });

};

export const showToastByOptions = (header = '', body = '', 
                        json= false, options = defaultOptions) => {
    toast(
        <ToastMsg header={header} body={body} isJson={json} />, 
        options
    );
};

export const successToast = (heading='', msg='', isJson=false) => {
    showToastByType(toast.TYPE.SUCCESS, heading, msg, isJson);
};

export const infoToast = (heading='', msg='', isJson=false) => {
    showToastByType(toast.TYPE.INFO, heading, msg, isJson);
};

export const warnToast = (heading='', msg='', isJson=false) => {
    showToastByType(toast.TYPE.WARNING, heading, msg, isJson);
};

export const errorToast = (heading='', msg='', isJson=false) => {
    showToastByType(toast.TYPE.ERROR, heading, msg, isJson);
};

export const darkToast = (heading='', msg='', isJson=false) => {
    showToastByType(toast.TYPE.DARK, heading, msg, isJson);
};

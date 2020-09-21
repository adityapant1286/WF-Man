import React from 'react';

import StepTenant from './stepTenant.js';

export const getSteps = () => {
    return ['Source Tenent', 'Repository', 'Target Tenant', 'Workflow'];
};

export const getStepContents = (step, props) => {
    switch(step) {
        case 0: return (
                    <StepTenant handleState={props.handleState} 
                        values={props.values} 
                        theme={props.theme} />
                );
        case 1: return (<h3>Step2</h3>);
        case 2: return (<h3>Step3</h3>);
        case 3: return (<h3>Step4</h3>);
        default: return '';
    }
};

/* export const handleStep = (step, props) => {
    switch(step) {
        case 1: debugLog(props.step0, true); break;;
        case 2: break;
        case 3: break;
        default:  break;
    }
}; */
import React from 'react';
import StepperComponent from './stepper/stepperComponent.js';

const MainComponents = (props) => {
    return (
        <StepperComponent theme={props.theme} />
    );
};

export default MainComponents;
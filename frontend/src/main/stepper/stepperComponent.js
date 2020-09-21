import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { getSteps, getStepContents } from './stepperHelper.js';
import { debugLog } from '../../common/consoleUtil.js';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        color: theme.palette.text.primary
    },
    paper: {
        maxWidth: 550,
        margin: 'auto'
    },
    buttonSection: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2)
    }
}));

const StepperComponent = (props) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        step0: {},
        step1: {},
        step2: {},
        step3: {}
    });
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
        debugLog(activeStep);
        // handleStep(activeStep + 1, formData);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        debugLog(activeStep);
    };

    const handleState = (step, stepData) => {
        setFormData({[step]: stepData});
    };

    return (
        <article className={classes.root}>
            <Paper className={classes.paper} >
                <Grid container>
                    <Grid item xs>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {
                                steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            <section>
                                            {
                                                getStepContents(index, { 
                                                        handleState: handleState,
                                                        values: {
                                                            ...formData
                                                        },
                                                        theme: props.theme 
                                                    })
                                            }
                                            </section>
                                            <section className={classes.buttonSection}>
                                                <Button disabled={activeStep === 0}
                                                    size="small"
                                                    onClick={handleBack}
                                                    className={classes.button}>
                                                    Back
                                                    </Button>
                                                <Button variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={handleNext}
                                                    className={classes.button}>
                                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
                                            </section>
                                        </StepContent>
                                    </Step>
                                ))
                            }
                        </Stepper>
                    </Grid>
                </Grid>
            </Paper>
        </article>
    );
};

export default StepperComponent;
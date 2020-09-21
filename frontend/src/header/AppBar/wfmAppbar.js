import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/MenuRounded';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescentRounded';
import { makeStyles } from '@material-ui/core/styles';

const userStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    themeToggleButton: {
        marginRight: theme.spacing(1),
        color: theme.palette.secondary.main
    },
    themeToggleButtonDark: {
        marginRight: theme.spacing(1),
        color: '#ffffff'
    },
    title: {
        flexGrow: 1
    }
}));

const WFMAppBar = (props) => {
    const classes = userStyles();
    
    const secondaryColor = {
        color: props.theme.palette.secondary.main
    };
    const [color, setColor] = useState(secondaryColor);
    
    const toggleTheme = (e) => {
        // changes app theme to dark mode. Calls parent function.        
        props.handler();
        
        setColor(e.currentTarget.style.color === 'rgb(0, 199, 212)'
                        ? {color: '#ffffff'}
                        : {color: '#00c7d4'});
    };

    return (
        <article className={classes.root}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Wk-Man
                    </Typography>
                    <IconButton edge="end" onClick={toggleTheme} 
                            className={classes.themeToggleButton} style={color}>
                        <WbIncandescentIcon />
                    </IconButton>
                    <IconButton edge="end" className={classes.menuButton} color="secondary" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </article>
    );
};

export default WFMAppBar;
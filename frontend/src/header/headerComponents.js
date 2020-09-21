import React from 'react';
import WFMAppBar from './AppBar/wfmAppbar.js';

const HeaderComponents = (props) => {
    return (        
        <WFMAppBar handler={props.handler} theme={props.theme} />
    );
};

export default HeaderComponents;
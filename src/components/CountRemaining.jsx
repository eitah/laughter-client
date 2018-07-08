import React from 'react';

import './CountRemaining.css';
import {MAX_LENGTH_OF_TWEET} from '../services/constants';

export default function CountRemaining ({ countRemaining }){
    return (<React.Fragment>
        <div className="countRemaining">{countRemaining}</div>
        <div className="countRemaining" style={{
            color: 'black',
            opacity: countRemaining / MAX_LENGTH_OF_TWEET,
        }}>{countRemaining}</div>
    </React.Fragment>);
}
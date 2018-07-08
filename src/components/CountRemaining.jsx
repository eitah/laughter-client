import React from 'react';

import './CountRemaining.css';
import {MAX_LENGTH_OF_TWEET} from '../services/constants';

function countCharactersRemaining (tweet = '') {
    return MAX_LENGTH_OF_TWEET - tweet.length;
}

export default function CountRemaining ({tweet}){
    const countRemaining = countCharactersRemaining(tweet);
    return (<React.Fragment>
        <div className="countRemaining">{countRemaining}</div>
        <div className="countRemaining" style={{
            color: 'black',
            opacity: countRemaining / MAX_LENGTH_OF_TWEET,
        }}>{countRemaining}</div>
    </React.Fragment>);
}
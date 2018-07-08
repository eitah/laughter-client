import React, {Component, createRef} from 'react';

import twitterHandleSearch from '../services/twitterHandleSearch';

import './TweetInput.css';
import ResultRow from './ResultRow';
import CountRemaining from "./CountRemaining";

async function getResults(search) {
    return twitterHandleSearch(search);
}

function getCurrentWord({tweet, cursorPosition}) {
    const startOfCurrentWord = tweet.lastIndexOf(' ', cursorPosition) + 1;
    let endOfCurrentWord = tweet.indexOf(' ', cursorPosition);
    if (endOfCurrentWord === -1) {
        endOfCurrentWord = tweet.length
    }
    const currentWord = tweet.substring(startOfCurrentWord, endOfCurrentWord);
    return {currentWord, startOfCurrentWord};
}

class TweetInput extends Component {
    constructor() {
        super();
        this.state = {
            tweet: '',
            search: '',
            userIsSearching: false,
            results: [],
            startOfCurrentWord: 0,
        };
        this.textarea = createRef();
    }

    handleInput = async (e) => {
        let results, search, userIsSearching;
        const tweet = e.target.value;
        const cursorPosition = e.target.selectionStart;

        const {startOfCurrentWord, currentWord} = getCurrentWord({tweet, cursorPosition});

        if (currentWord.startsWith('@') && currentWord.length > 2) {
            userIsSearching = true;
            search = currentWord.substr(1);
            results = await getResults(search);
            this.setState({tweet, userIsSearching, startOfCurrentWord, search, results});
        } else {
            userIsSearching = false;
            this.setState({tweet, userIsSearching, startOfCurrentWord});
        }
    };


    handleOnClick = (event, screenName) => {
        const tweet = this.replaceCurrentSearchWithCorrectHandle(screenName);
        const tweetElement = this.textarea.current;
        tweetElement.value = tweet;
        tweetElement.focus();
        this.setState({userIsSearching: false, tweet});
    };

    replaceCurrentSearchWithCorrectHandle = (resultSelected) => {
        const {tweet, search, startOfCurrentWord} = this.state;
        const before = tweet.substring(0, startOfCurrentWord);
        const after = tweet.substring(startOfCurrentWord + search.length + 1, tweet.length);
        return before + '@' + resultSelected + after;
    };

    render() {
        const {tweet, results, userIsSearching} = this.state;
        return (
            <div className="wrapper">
                <div className="background">
                    <div className="tweetContainer">
                        <textarea
                            className="tweetInput"
                            ref={this.textarea} cols="50" rows="10"
                            onInput={this.handleInput}/>
                        <CountRemaining tweet={tweet}/>
                    </div>
                </div>
                {userIsSearching &&
                <div className="resultsOverlay">
                    {results.map(user => <ResultRow
                        key={user.id}
                        user={user}
                        handleOnClick={this.handleOnClick}/>)}
                </div>}
            </div>
        );
    }
}

export default TweetInput;

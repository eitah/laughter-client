import React, {Component, createRef} from 'react';
import twitterHandleSearch from '../../services/twitterHandleSearch';
import {debounce} from 'throttle-debounce';

import './TweetInput.css';
import ResultRow from './ResultRow/ResultRow';
import CountRemaining from "./CountRemaining/CountRemaining";

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
        this.performSearchThrottled = debounce(250, this.performSearch);
    }

    handleInput = async (e) => {
        let userIsSearching;
        const tweet = e.target.value;
        const cursorPosition = e.target.selectionStart;

        const {startOfCurrentWord, currentWord} = getCurrentWord({tweet, cursorPosition});

        if (currentWord.startsWith('@') && currentWord.length > 2) {
            this.performSearchThrottled({ tweet, currentWord, startOfCurrentWord});
        } else {
            userIsSearching = false;
            this.setState({tweet, userIsSearching, startOfCurrentWord});
        }
    };

    performSearch = async ({tweet, currentWord, startOfCurrentWord}) => {
        const search = currentWord.substr(1);
        const results = await twitterHandleSearch(search);
        this.setState({
            tweet,
            userIsSearching: true,
            startOfCurrentWord,
            search,
            results
        });
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

function getCurrentWord({tweet, cursorPosition}) {
    const lastEnter = tweet.lastIndexOf('\n', cursorPosition) + 1;
    const lastSpace = tweet.lastIndexOf(' ', cursorPosition) + 1;
    const startOfCurrentWord = Math.max(lastEnter, lastSpace);

    const nextWhitespace = tweet.substr(startOfCurrentWord).match(/\s/);
    const endOfCurrentWord = (nextWhitespace) ? startOfCurrentWord + nextWhitespace.index : tweet.length;

    let currentWord = tweet.substring(startOfCurrentWord, endOfCurrentWord);
    return {currentWord, startOfCurrentWord};
}

export default TweetInput;

import React, {Component, createRef} from 'react';

import twitterHandleSearch from '../services/twitterHandleSearch';

import './TweetInput.css';
import ResultRow from './ResultRow';
import CountRemaining from "./CountRemaining";

async function getResults(search) {
    return twitterHandleSearch(search);
}

class TweetInput extends Component {
    constructor() {
        super();
        this.state = {
            tweet: '',
            search: '',
            lastAt: -1,
            userIsSearching: false,
            results: [],
        };
        this.textarea = createRef();
    }

    handleInput = async (e) => {
        let {lastAt, search, results, userIsSearching} = this.state;
        const tweet = e.target.value;
        const keystroke = e.nativeEvent.data;

        const cursorPosition = e.target.selectionStart;
        // confirm if user is searching
        lastAt = tweet.lastIndexOf('@', cursorPosition);
        // console.error('lastAt', lastAt)
        if (lastAt !== -1) {
            //handle if user stops searching
            if (tweet.substr(lastAt + 1, tweet.length).split(' ').length > 1) {
                userIsSearching = false;
                return this.setState({userIsSearching, tweet})
            }

            // extract search from tweet
            search = tweet.substr(lastAt + 1, tweet.length).split(' ')[0];
            // console.error('search', search);


            // if the search is at least 2 characters
            if (search.length > 1) {
                userIsSearching = true;
                results = await getResults(search);
            }
            return this.setState({tweet, search, lastAt, userIsSearching, results});
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
        const {search, lastAt, tweet} = this.state;
        const before = tweet.substring(0, lastAt + 1);
        const after = tweet.substring(lastAt + search.length + 1, tweet.length);
        return before + resultSelected + after;
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

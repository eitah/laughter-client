import React, {Component, createRef} from 'react';

import './TweetInput.css';
import mock from './mock.json';
import ResultRow from './ResultRow';

const MAX_LENGTH_OF_TWEET = 150;

async function getResults(search) {
    return mock.users;
    // try {
    //     const url = `http://localhost:4000/twitter/user/search?username=${search}`;
    //     const response = await fetch(url);
    //     if (!response.ok) {
    //         throw new Error(`getResults from twitter user search for string ${search} failed with status ${response.status}`)
    //     }
    //     let json = await response.json();
    //     return json.users
    // }
    // catch (e) {
    //     console.error(e && e.message);
    //     return [];
    // }
}

class TweetInput extends Component {
    constructor() {
        super();
        this.state = {
            tweet: '@ca',
            search: 'ca',
            lastAt: 0,
            userIsSearching: true,
            results: [],
            countRemaining: MAX_LENGTH_OF_TWEET,
        };
        // this.handleOnClick = this.handleOnClick.bind(this);
        this.textarea = createRef();
    }

    handleInput = async (e) => {
        let {lastAt, search, results, userIsSearching} = this.state;
        const tweet = e.target.value;
        const keystroke = e.nativeEvent.data;

        const countRemaining = this.countCharactersRemaining(tweet);

        const cursorPosition = e.target.selectionStart;
        // confirm if user is searching
        lastAt = tweet.lastIndexOf('@', cursorPosition);
        // console.error('lastAt', lastAt)
        if (lastAt !== -1) {
            //handle if user stops searching
            if (tweet.substr(lastAt + 1, tweet.length).split(' ').length > 1) {
                userIsSearching = false;
                return this.setState({userIsSearching, countRemaining})
            }

            // extract search from tweet
            search = tweet.substr(lastAt + 1, tweet.length).split(' ')[0];
            // console.error('search', search);


            // if the search is at least 2 characters
            if (search.length > 1) {
                userIsSearching = true;
                results = await getResults(search);
            }
            return this.setState({tweet, search, lastAt, userIsSearching, results, countRemaining});
        }
    };

    handleOnClick = (event, screenName) => {
        const tweetElement = this.textarea.current;
        tweetElement.value = this.replaceCurrentSearchWithCorrectHandle(screenName);
        tweetElement.focus();
        const countRemaining = this.countCharactersRemaining(tweetElement.value);
        this.setState({userIsSearching: false, countRemaining});
    };

    replaceCurrentSearchWithCorrectHandle = (resultSelected) => {
        const {search, lastAt, tweet} = this.state;
        const before = tweet.substring(0, lastAt + 1);
        const after = tweet.substring(lastAt + search.length + 1, tweet.length);
        return before + resultSelected + after;
    };

    paintResults = () => {
        const {results, userIsSearching} = this.state;
        return (userIsSearching &&
            <div className="resultsOverlay">
                there are some results for {results.map(user => <ResultRow key={user.id} user={user}
                                                                           handleOnClick={this.handleOnClick}/>)}
            </div>
        );
    };

    countCharactersRemaining = (tweet = '') => {
        return MAX_LENGTH_OF_TWEET - tweet.length;
    };

    renderCountRemaining = () => {
        const {countRemaining} = this.state;
        return (<React.Fragment>
            <div className="countRemaining">{countRemaining}</div>
            <div className="countRemaining" style={{
                color: 'black',
                opacity: countRemaining / MAX_LENGTH_OF_TWEET,
            }}>{countRemaining}</div>
        </React.Fragment>);
    };


    render() {
        return (
            <div className="wrapper">
                <div className="background">
                    <div className="tweetContainer">
                        {this.renderCountRemaining()}
                        <textarea
                            className="tweetInput"
                            name="tweet_input"
                            defaultValue="@ca"
                            ref={this.textarea} cols="50" rows="10"
                            onInput={this.handleInput}/>
                    </div>
                </div>
                {this.paintResults()}
            </div>
        );
    }
}

export default TweetInput;

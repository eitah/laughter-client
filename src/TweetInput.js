import React, {Component, createRef} from 'react';

// import './App.css';
import mock from './mock.json';
import twitterLogoSvg from './Twitter_Logo_Blue.svg';

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
            tweet: '@',
            search: '',
            lastAt: -1,
            userIsSearching: true,
            results: mock.users,
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.textarea = createRef();
    }

    handleInput = async (e) => {
        let {lastAt, search, results, userIsSearching} = this.state;
        const tweet = e.target.value;
        const keystroke = e.nativeEvent.data;

        if (keystroke === ' ') {
            userIsSearching = false;
            return this.setState({userIsSearching})
        }

        const cursorPosition = e.target.selectionStart;
        // confirm if user is searching
        lastAt = tweet.lastIndexOf('@', cursorPosition);
        // console.error('lastAt', lastAt)
        if (lastAt !== -1) {
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

    handleOnClick = (e) => {
        const resultSelected = e.target.parentElement.dataset.screenName;
        const tweetElement = this.textarea.current;
        tweetElement.value = this.replaceCurrentSearchWithCorrectHandle(resultSelected);
        tweetElement.focus();
        this.setState({userIsSearching: false});
    };

    replaceCurrentSearchWithCorrectHandle = (resultSelected) => {
        const {search, lastAt, tweet} = this.state;
        const before = tweet.substring(0, lastAt + 1);
        const after = tweet.substring(lastAt + search.length +1, tweet.length);
        return before + resultSelected + after;
    };

    paintResults = () => {
        const {results, userIsSearching} = this.state;
        return (userIsSearching &&
            <div style={{textAlign: 'left'}}>
                there are some results for {results.map(user => this.paintUserRow(user))}
            </div>
        );
    };

    paintUserRow = (user) => {
        return (
            <div key={user.screen_name} data-screen-name={user.screen_name} onClick={this.handleOnClick}>
                <img src={user.profile_image_url}/>
                <img src={twitterLogoSvg} style={{height: 20}}/>
                <span style={{fontWeight: 700}}>@{user.screen_name}</span>
                <span style={{padding: 10, color: 'gray'}}>{user.name}</span>
            </div>);
    };

    render() {
        return (
            <div>
                <div>
                    <textarea name="tweet_input" defaultValue="@" ref={this.textarea} cols="50" rows="10" onInput={this.handleInput}/>
                </div>
                {this.paintResults()}
            </div>
        );
    }
}

export default TweetInput;

import React, {Component} from 'react';

// import './App.css';

async function getResults(search) {
    return [
        {cat: 'dog',},
    ];
}

class TweetInput extends Component {
    constructor(orios) {
        super();
        this.state = {
            search: '',
            userIsSearching: false,
            lastAt: 0,
            results: false,
            cursorIndex: 0,
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleInput = async (e) => {
        let userIsSearching;
        let {lastAt, search, results, cursorIndex} = this.state;
        const tweet = e.target.value;
        // const keystroke = e.nativeEvent.data;

        // exclude @s that are already resolved.
        const indexOfLastAtSign = tweet.lastIndexOf('@');

        // confirm if user is searching
        if (indexOfLastAtSign !== -1) {

            // omit @ from search
            search = tweet.substr(indexOfLastAtSign + 1, tweet.length).trim();

            // if the search is at least 2 characters
            if (search.length > 1) {
                userIsSearching = true;
                console.error(search, search.length);
                results = await
                    getResults(search);
            }

        }

        this.setState({ tweet, search, lastAt, userIsSearching, results});
        // debugger;
    };

    handleOnClick = (e) => {
        const resultSelected = e.target.textContent;
        // console.error(resultSelected);
        const tweetElement = document.getElementsByName('tweet_input')[0];
        const tweet = tweetElement.value;
        // const theSearchStringIndex = this.state.tweet.lastIndexOf(this.state.search);
        tweetElement.value = tweet.replace(this.state.search, resultSelected);
    };

    render() {
        const {tweet, results} = this.state;
        return (
            <div>
                <div>
                    <textarea name="tweet_input" cols="50" rows="10" onInput={this.handleInput}/>
                </div>
                {results && <div>
                    there are some results, {results.map(result => <p key={result.cat}
                                                                      onClick={this.handleOnClick}>{result.cat}</p>)}
                </div>}
            </div>
        );
    }
}

export default TweetInput;

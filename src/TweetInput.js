import React, {Component} from 'react';

// import './App.css';

async function getResults(search) {
    return [
        {cat: 'dog',},
    ];
}

class TweetInput extends Component {
    constructor() {
        super();
        this.state = {
            search: '',
            userIsSearching: false,
            lastAt: 0,
            results: [],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleInput = async (e) => {
        let {lastAt, search, results, userIsSearching} = this.state;
        const tweet = e.target.value;
        // const keystroke = e.nativeEvent.data;

        // confirm if user is searching
        const indexOfLastAtSign = tweet.lastIndexOf('@');
        if (indexOfLastAtSign !== -1) {
            // extract search from tweet
            search = tweet.substr(indexOfLastAtSign + 1, tweet.length);

            //check if there is more than one word
            if (search.split(' ').length > 1) {
                userIsSearching = false;
                return this.setState({userIsSearching});
            }

            // if the search is at least 2 characters
            if (search.length > 1) {
                userIsSearching = true;
                results = await
                    getResults(search);
            }
            return this.setState({tweet, search, lastAt, userIsSearching, results});
        }
    };

    handleOnClick = (e) => {
        const resultSelected = e.target.textContent;
        const tweetElement = document.getElementsByName('tweet_input')[0];
        const tweet = tweetElement.value;
        tweetElement.value = tweet.replace(this.state.search, resultSelected);
        tweetElement.focus();
        this.setState({userIsSearching: false});
    };

    paintResults = () => {
        const {results = [], userIsSearching} = this.state;
        return (userIsSearching && <div>
            there are some results, {results.map(result => <p key={result.cat}
                                                              onClick={this.handleOnClick}>{result.cat}</p>)}
        </div>);
    };

    render() {
        const {userIsSearching} = this.state;
        return (
            <div>
                <div>
                    <textarea name="tweet_input" cols="50" rows="10" onInput={this.handleInput}/>
                </div>
                {this.paintResults()}
            </div>
        );
    }
}

export default TweetInput;

import React, {Component} from 'react';

// import './App.css';

class TweetInput extends Component {
    state = {
        value: '',
        userIsSearching: false,
        lastFoundAt: 0
    };

    handleInput = (e) => {
        const {value} = this.state;
        const newState = { ...this.state, value: e.target.value };
        const keystroke = e.nativeEvent.data;
        console.error(' i had', value);
        console.error(' i pressed', keystroke);

        if (keystroke === '@') {
            newState.userIsSearching = true;
            if (value.indexOf('@') !== -1 ) {
                newState.lastFoundAt = newState.value.length;
            }
        }

        const tweetLength = newState.value.length;
        const positionOfAt = newState.value.indexOf('@', newState.lastFoundAt);
        if (newState.userIsSearching && positionOfAt !== -1) {
            const lengthAfterTheAt =  tweetLength - positionOfAt - 1; // +1 adjusts for indexof
            console.error(tweetLength, positionOfAt, lengthAfterTheAt);

        }

        this.setState(newState);
        // debugger;
    };

    render() {
        const {value} = this.state;
        return (
            <div>
                <div>
                    <textarea name="tweet_input" value={value} cols="50" rows="10" onInput={this.handleInput}/>
                </div>
            </div>
        );
    }
}

export default TweetInput;

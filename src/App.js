import React, {Component} from 'react';
import './App.css';
import TweetInput from './components/TweetInput/TweetInput';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to Twitter</h1>
                </header>
                <p className="App-intro">
                    Compose a tweet
                </p>
                <TweetInput />
            </div>
        );
    }
}

export default App;

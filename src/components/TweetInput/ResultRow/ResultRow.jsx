import React from 'react';
import twitterLogoSvg from '../../../assets/Twitter_Logo_Blue.svg';
import './ResultRow.css'

class ResultRow extends React.PureComponent {
    handleClick = (event) => {
        event.stopPropagation();
        this.props.handleOnClick(event, this.props.user.screen_name);
    };

    render() {
        const {user} = this.props;
        const screenName = user.screen_name;
        const verified = user.verified;
        return (
            <div tabIndex="0" className="resultRow" onClick={this.handleClick} onKeyPress={this.handleClick}>
                <div className="leftItems">
                    <img src={user.profile_image_url}/>
                    <img src={twitterLogoSvg}/>
                    <span className="screenName">@{screenName}</span>
                    <span className="userName">{user.name}</span>
                </div>
                {verified && <span className="verified">VERIFIED</span>}
            </div>);
    }
}


export default ResultRow;
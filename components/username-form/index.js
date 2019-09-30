import React, { Component } from 'react';
import Router, { withRouter } from 'next/router'
import UsernameInput from './username-input';

class UsernameForm extends Component {

    static defaultProps = {
        username: ''
    };

    state = {
        username: this.props.username
    };

    handleChange = event => {
        this.setState({username: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        const username = this.state.username;

        if (username.trim().length === 0) {
            return;
        }

        Router.push({
            pathname: '/' + username,
        });
    };

    render() {
        return (
            <div className="pb-4 md:pt-16">
                <form className="flex h-8 mx-auto w-5/6 md:w-3/5 lg:w-1/3" action="/" method="get" onSubmit={this.handleSubmit}>
                    <UsernameInput
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                    <button className="bn br--right bg-mid-purple hover:bg-light-blue hover:text-mid-blue rounded-r-sm px-4 pointer text-white" type="submit">
                        Check
                    </button>
                </form>
            </div>
        );
    }
}

export default withRouter(UsernameForm);

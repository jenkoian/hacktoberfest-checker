import React from 'react';
import UsernameInput from './username-input';

class UsernameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div className="pb-4 md:pt-16">
                <form className="flex h-8 mx-auto w-5/6 md:w-3/5 lg:w-1/3" action="/" method="get" onSubmit={this.handleSubmit}>
                    <UsernameInput
                        value={this.state.value}
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

export default UsernameForm;

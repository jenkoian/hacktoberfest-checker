import React, { Component } from 'react';

class PullRequests extends Component {

    render() {
        const username = this.props.username;
        const {loading, data, error} = this.state;

        if (loading) {
            return <LoadingIcon/>;
        }

        if (error || data.error_description) {
            return <ErrorText errorMessage={this.getErrorMessage()}/>;
        }

        const isComplete = data.prs.length >= pullRequestAmount;

        return (
            <div className="text-center text-white">
                <ShareButtons
                    username={username}
                    pullRequestCount={data.prs.length}
                />
                <UserInfo
                    username={username}
                    userImage={data.userImage}
                    pullRequestCount={data.prs.length}
                />
            </div>
            <div className="rounded mx-auto shadow overflow-hidden w-5/6 lg:w-1/2 mb-4">
                {data.prs.length &&
                data.prs.map((pullRequest, i) => (
                    <PullRequest pullRequest={pullRequest} key={i}/>
                ))}
            </div>
            {!isComplete && <IssuesLink/>}
            <MeLinkInfo username={username}/>
        );
    };
}

export default PullRequests;

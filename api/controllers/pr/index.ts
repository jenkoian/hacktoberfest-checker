import { Response, Request } from 'express';
import moment from 'moment';
import { Resources } from '@gitbeaker/core';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';
import { UserSchema } from '@gitbeaker/core/dist/types/resources/Users';
import {
  findGithubPrs,
  searchGithubUser,
  GithubPullRequestApproved,
} from './findPrs/github';
import {
  findGitlabPrs,
  searchGitlabUser,
  GitlabPullRequestApproved,
} from './findPrs/gitlab';
import { getStatusCode, getErrorDescription } from './errors';

class PrController {
  index(req: Request, res: Response) {
    const github: Octokit = req.app.get('github');
    const gitlab: Resources.Gitlab = req.app.get('gitlab');
    const username = req.query.username as string;

    if (!username) {
      return res.status(400).json({
        error_description: 'No username provided!',
      });
    }

    Promise.all([
      findGithubPrs(github, username),
      findGitlabPrs(gitlab, username),
      searchGithubUser(github, username),
      searchGitlabUser(gitlab, username),
    ])
      .then(
        ([prs, mrs, user, gitlab_user]: [
          prs: GithubPullRequestApproved[] | null,
          mrs: GitlabPullRequestApproved[],
          user:
            | RestEndpointMethodTypes['users']['getByUsername']['response']
            | boolean,
          gitlab_user: UserSchema[] | boolean
        ]) => {
          let isGitHubUser = true;
          let isGitLabUser = true;

          if (user === false) isGitHubUser = false;
          if (gitlab_user === false) isGitLabUser = false;

          if (!isGitHubUser && !isGitLabUser) {
            return Promise.reject('notUser');
          }

          // Combine github PRs with the gitlab MRs in sorted order.
          // Most recent PRs/MRs will come first.
          if (prs == null) {
            prs = [];
          }

          prs = prs.concat(mrs).sort((pr1, pr2) => {
            const date1 = moment(pr1.created_at, 'MMMM Do YYYY');
            const date2 = moment(pr2.created_at, 'MMMM Do YYYY');
            if (date1.isSame(date2)) return 0;
            else if (date1.isAfter(date2)) return -1;
            return 1;
          });

          const data = {
            prs,
            username,
            userImage: isGitHubUser
              ? typeof user === 'boolean'
                ? ''
                : user.data.avatar_url
              : gitlab_user[0].avatar_url,
          };

          res.json(data);
        }
      )
      .catch((err) => {
        console.log('Error: ' + err);

        const statusCode = getStatusCode(err);
        const errorDescription = getErrorDescription(err);

        res.status(statusCode).json({
          error_description: errorDescription,
        });
      });
  }
}

export default new PrController();

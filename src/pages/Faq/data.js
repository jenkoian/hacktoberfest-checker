export default [
  {
    question: "Why do some PRs have 'Pending' next to them?",
    answer:
      "There is a grace period this year which means that a PR must be open (or merged/approved) for at least two weeks in order to give maintainers the chance to mark issues as invalid. Therefore, the PR will be marked as 'Pending' until that grace period has expired.",
  },
  {
    question: 'Why do some PRs show outside of October?',
    answer:
      "If you've submitted a PR on the last day of September or the first day of November, there is a chance of it counting if it is October in any timezone.",
  },
  {
    question:
      "Why is this project needed if Hacktoberfest's `Profile` now shows your progress?",
    answer:
      "While it is true you can see your progress on Hacktoberfest's official website at https://hacktoberfest.digitalocean.com/profile it requires that you authenticate with Github. Hacktoberfest Checker doesn't require authentication so you can check on your own progress, or your mates progress, without needing to log in. Plus this is still a really fun and rewarding project to work on and we've done it for years before they ever thought to do it themselves :-)",
  },
];

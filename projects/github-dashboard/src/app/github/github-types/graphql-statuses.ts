export interface GithubGraphQLStatuses {
  data: {[key in string]: {pullRequest: PullRequestStatus}};
}

interface PullRequestStatus {
  number: number;
  commits: {nodes: {commit: {status: {contexts: StatusContext[]}}}[]};
}

interface StatusContext {
  context: string;
  state: string;
}

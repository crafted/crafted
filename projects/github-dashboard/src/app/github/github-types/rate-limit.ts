export interface GithubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

export interface GithubRateLimitResources {
  core: GithubRateLimit;
  search: GithubRateLimit;
  graphql: GithubRateLimit;
  integration_manifest: GithubRateLimit;
}

export interface GithubRateLimitResponse {
  rate: GithubRateLimit;
  resources: GithubRateLimitResources;
}

import {GithubContributor} from '../github-types/contributor';

export interface Contributor {
  login: string;
  id: string;
  avatar_url: string;
  contributions: number;
  dbAdded?: string;
  dbModified?: string;
}

export function githubContributorToContributor(o: GithubContributor): Contributor {
  return {login: o.login, id: `${o.id}`, avatar_url: o.avatar_url, contributions: o.contributions};
}

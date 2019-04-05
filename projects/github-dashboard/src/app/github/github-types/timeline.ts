import {GithubActor} from './actor';
import {User} from './user';

export interface GithubTimelineEvent {
  id: number;
  node_id: string;
  url: string;
  actor: GithubActor;
  event: string;
  commit_id: string;
  commit_url: string;
  created_at: string;
  label: {name: string, color: string};
  labels: {name: string, color: string}[];
  lock_reason: string;
  assignee: User;
  assignees: User[];

  assigner: User;
  dismissed_review: any;
  milestone: {title: string};
  rename: {from: string, to: string};
  requested_reviewers: any;
  review_requester: any;
}

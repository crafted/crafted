import {Reactions} from './reactions';
import {User} from './user';

export interface GithubIssue {
  url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: any[];
  state: string;
  locked: boolean;
  assignee?: any;
  assignees: any[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  body: string;
  reactions: Reactions;

  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  pull_request: any;
}

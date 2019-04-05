import {GithubLabel} from '../github-types/label';

export interface Label {
  id: string;
  name: string;
  description: string;
  color: string;
  dbAdded?: string;
  dbModified?: string;
}

export function githubLabelToLabel(o: GithubLabel): Label {
  return {
    id: `${o.id}`,
    name: o.name,
    description: o.description,
    color: o.color,
  };
}

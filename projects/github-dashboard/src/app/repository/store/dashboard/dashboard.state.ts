import {Dashboard} from 'projects/github-dashboard/src/app/components';
import {EntityState} from '@ngrx/entity';

export interface DashboardState extends EntityState<Dashboard> {
  ids: string[];
  loading: boolean;
}

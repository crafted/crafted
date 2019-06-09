import {Dashboard} from '@crafted/components';
import {EntityState} from '@ngrx/entity';

export interface DashboardState extends EntityState<Dashboard> {
  ids: string[];
}

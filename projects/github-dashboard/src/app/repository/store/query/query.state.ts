import {EntityState} from '@ngrx/entity';
import {Query} from '../../model/query';

export interface QueryState extends EntityState<Query> {
  ids: string[];
  loading: boolean;
}

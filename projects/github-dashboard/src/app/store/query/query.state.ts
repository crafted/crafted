import {EntityState} from '@ngrx/entity';
import {Query} from '../../repository/model/query';

export interface QueryState extends EntityState<Query> {
  ids: string[];
}

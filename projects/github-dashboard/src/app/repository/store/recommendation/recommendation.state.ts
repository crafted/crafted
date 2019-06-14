import {EntityState} from '@ngrx/entity';
import {Recommendation} from '../../model/recommendation';

export interface RecommendationState extends EntityState<Recommendation> {
  ids: string[];
  loading: boolean;
}

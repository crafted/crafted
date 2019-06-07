import {EntityState} from '@ngrx/entity';
import {Recommendation} from '../../repository/model/recommendation';

export interface RecommendationState extends EntityState<Recommendation> {
  ids: string[];
}

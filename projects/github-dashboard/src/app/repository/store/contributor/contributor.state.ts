import {EntityState} from '@ngrx/entity';
import {Contributor} from '../../../github/app-types/contributor';

export interface ContributorState extends EntityState<Contributor> {
  ids: string[];
  loading: boolean;
}


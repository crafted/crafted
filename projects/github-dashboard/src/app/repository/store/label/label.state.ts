import {EntityState} from '@ngrx/entity';
import {Label} from '../../../github/app-types/label';

export interface LabelState extends EntityState<Label> {
  ids: string[];
}


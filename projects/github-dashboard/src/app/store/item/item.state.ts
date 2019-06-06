import {EntityState} from '@ngrx/entity';
import {Item} from '../../github/app-types/item';

export interface ItemState extends EntityState<Item> {
  ids: string[];
  repository: string;
}

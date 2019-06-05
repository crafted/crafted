import {Item} from '../../github/app-types/item';
import {EntityState} from '@ngrx/entity';

export interface ItemState extends EntityState<Item> {}

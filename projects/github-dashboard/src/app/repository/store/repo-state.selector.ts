import {createFeatureSelector} from '@ngrx/store';
import {AppState, RepoState} from './index';

export const getRepoState = createFeatureSelector<AppState, RepoState>('repository');

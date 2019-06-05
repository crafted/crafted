import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ItemActionTypes} from './item.action';

@Injectable()
export class ItemEffects {

  constructor(
    private actions$: Actions,
  ) {}
}

import {animate, state, style, transition, trigger} from '@angular/animations';

export const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

export const EXPANSION_ANIMATION = [
  trigger(
      'expansionContent',
      [
        state('void, false', style({height: '0px'})),
        state('true', style({height: '*'})),
        transition('* <=> *', animate(ANIMATION_DURATION)),
      ]),
  trigger(
      'expansionIndicator',
      [
        state('void, false', style({transform: 'rotateX(0deg)'})),
        state('true', style({transform: 'rotateX(180deg)'})),
        transition('* <=> *', animate(ANIMATION_DURATION)),
      ]),
];

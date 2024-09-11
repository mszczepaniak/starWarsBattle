import { createAction, props } from '@ngrx/store';
import { ResourceType, Card, Winner } from '../models/models';

export const setResource = createAction(
  '[Battle] Set Resource',
  props<{ resource: ResourceType }>(),
);

export const setProperty = createAction(
  '[Battle] Set Property',
  props<{ property: string }>(),
);

export const loadCards = createAction('[Battle] Load Cards');

export const loadCardsSuccess = createAction(
  '[Battle] Load Cards Success',
  props<{ leftCard: Card; rightCard: Card }>(),
);

export const loadCardsFailure = createAction('[Battle] Load Cards Failure');

export const determineWinner = createAction('[Battle] Determine Winner');

export const updateScores = createAction(
  '[Battle] Update Scores',
  props<{ winner: Winner }>(),
);

export const resetGame = createAction('[Battle] Reset Game');

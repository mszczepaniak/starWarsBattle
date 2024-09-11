import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BattleState } from './battle-reducer';

export const selectBattleState = createFeatureSelector<BattleState>('battle');

export const selectResource = createSelector(
  selectBattleState,
  (state) => state.selectedResource,
);

export const selectProperty = createSelector(
  selectBattleState,
  (state) => state.selectedProperty,
);

export const selectLeftCard = createSelector(
  selectBattleState,
  (state) => state.leftCard,
);

export const selectRightCard = createSelector(
  selectBattleState,
  (state) => state.rightCard,
);

export const selectWinner = createSelector(
  selectBattleState,
  (state) => state.winner,
);

export const selectLeftScore = createSelector(
  selectBattleState,
  (state) => state.leftScore,
);

export const selectRightScore = createSelector(
  selectBattleState,
  (state) => state.rightScore,
);

export const selectIsLoading = createSelector(
  selectBattleState,
  (state) => state.isLoading,
);

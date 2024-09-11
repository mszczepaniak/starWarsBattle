import { createReducer, on } from '@ngrx/store';
import * as BattleActions from './battle-actions';
import { Card, ResourceType, Winner } from '../models/models';

export interface BattleState {
  selectedResource: ResourceType;
  selectedProperty: string;
  leftCard: Card | null;
  rightCard: Card | null;
  winner: Winner;
  leftScore: number;
  rightScore: number;
  error: boolean;
  isLoading: boolean;
}

export const initialState: BattleState = {
  selectedResource: 'people',
  selectedProperty: 'mass',
  leftCard: null,
  rightCard: null,
  winner: null,
  leftScore: 0,
  rightScore: 0,
  error: false,
  isLoading: false,
};

export const battleReducer = createReducer(
  initialState,
  on(BattleActions.setResource, (state, { resource }) => ({
    ...state,
    selectedResource: resource,
  })),
  on(BattleActions.setProperty, (state, { property }) => ({
    ...state,
    selectedProperty: property,
  })),
  on(BattleActions.loadCards, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(BattleActions.loadCardsSuccess, (state, { leftCard, rightCard }) => ({
    ...state,
    leftCard,
    rightCard,
    winner: null,
    error: false,
    isLoading: false,
  })),
  on(BattleActions.loadCardsFailure, (state) => ({
    ...state,
    error: true,
    isLoading: false,
  })),
  on(BattleActions.updateScores, (state, { winner }) => ({
    ...state,
    winner,
    leftScore:
      winner === 'left' || winner === 'draw'
        ? state.leftScore + 1
        : state.leftScore,
    rightScore:
      winner === 'right' || winner === 'draw'
        ? state.rightScore + 1
        : state.rightScore,
  })),
  on(BattleActions.resetGame, () => ({
    ...initialState,
  })),
);

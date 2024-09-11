import { BattleState, initialState, battleReducer } from './battle-reducer';
import * as BattleActions from './battle-actions';
import * as BattleSelectors from './battle-selectors';
import { BattleEffects } from './battle-effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { StarWarsService } from '../services/star-wars.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Card, StarWarsItem } from '../models/models';

describe('Battle Reducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'NOOP' };
    const result = battleReducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should handle setResource action', () => {
    const newResource = 'starships';
    const action = BattleActions.setResource({ resource: newResource });
    const result = battleReducer(initialState, action);

    expect(result.selectedResource).toBe(newResource);
  });

  it('should handle setProperty action', () => {
    const newProperty = 'height';
    const action = BattleActions.setProperty({ property: newProperty });
    const result = battleReducer(initialState, action);

    expect(result.selectedProperty).toBe(newProperty);
  });
  it('should handle loadCardsSuccess action', () => {
    const leftCard: Card = { properties: { name: 'Luke' } };
    const rightCard: Card = { properties: { name: 'Vader' } };
    const action = BattleActions.loadCardsSuccess({ leftCard, rightCard });
    const result = battleReducer(initialState, action);

    expect(result.leftCard).toBe(leftCard);
    expect(result.rightCard).toBe(rightCard);
    expect(result.winner).toBeNull();
    expect(result.error).toBe(false);
    expect(result.isLoading).toBe(false);
  });

  it('should handle updateScores action', () => {
    const winner = 'left';
    const action = BattleActions.updateScores({ winner });
    const result = battleReducer(initialState, action);

    expect(result.winner).toBe(winner);
    expect(result.leftScore).toBe(1);
    expect(result.rightScore).toBe(0);
  });

  it('should handle resetGame action', () => {
    const modifiedState: BattleState = {
      ...initialState,
      leftScore: 5,
      rightScore: 3,
      winner: 'left',
    };
    const action = BattleActions.resetGame();
    const result = battleReducer(modifiedState, action);

    expect(result).toEqual(initialState);
  });
});

describe('Battle Selectors', () => {
  let store: MockStore<{ battle: BattleState }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            battle: {
              ...initialState,
              selectedResource: 'people',
              selectedProperty: 'mass',
              leftCard: {
                properties: { name: 'Luke' },
              } as Card,
              rightCard: {
                properties: { name: 'Vader' },
              } as Card,
              winner: 'left',
              leftScore: 2,
              rightScore: 1,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the resource', (done) => {
    store.select(BattleSelectors.selectResource).subscribe((result) => {
      expect(result).toBe('people');
      done();
    });
  });

  it('should select the property', (done) => {
    store.select(BattleSelectors.selectProperty).subscribe((result) => {
      expect(result).toBe('mass');
      done();
    });
  });

  it('should select the left card', (done) => {
    store.select(BattleSelectors.selectLeftCard).subscribe((result) => {
      expect(result).toEqual({ properties: { name: 'Luke' } });
      done();
    });
  });

  it('should select the right card', (done) => {
    store.select(BattleSelectors.selectRightCard).subscribe((result) => {
      expect(result).toEqual({ properties: { name: 'Vader' } });
      done();
    });
  });

  it('should select the winner', (done) => {
    store.select(BattleSelectors.selectWinner).subscribe((result) => {
      expect(result).toBe('left');
      done();
    });
  });

  it('should select the left score', (done) => {
    store.select(BattleSelectors.selectLeftScore).subscribe((result) => {
      expect(result).toBe(2);
      done();
    });
  });

  it('should select the right score', (done) => {
    store.select(BattleSelectors.selectRightScore).subscribe((result) => {
      expect(result).toBe(1);
      done();
    });
  });

  it('should select isLoading', (done) => {
    store.select(BattleSelectors.selectIsLoading).subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });
});

describe('Battle Effects', () => {
  let actions$: Observable<Action>;
  let effects: BattleEffects;
  let starWarsService: jest.Mocked<StarWarsService>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BattleEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            battle: {
              ...initialState,
              selectedResource: 'people',
              selectedProperty: 'mass',
            },
          },
        }),
        {
          provide: StarWarsService,
          useValue: {
            getRandomItem: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(BattleEffects);
    starWarsService = TestBed.inject(
      StarWarsService,
    ) as jest.Mocked<StarWarsService>;
    store = TestBed.inject(MockStore);
  });

  it('should load cards successfully', (done) => {
    const leftCard: Card = {
      properties: { name: 'Luke', mass: '77' } as StarWarsItem,
    };
    const rightCard: Card = {
      properties: { name: 'Vader', mass: '120' } as StarWarsItem,
    };

    starWarsService.getRandomItem.mockReturnValueOnce(of(leftCard.properties));
    starWarsService.getRandomItem.mockReturnValueOnce(of(rightCard.properties));

    actions$ = of(BattleActions.loadCards());

    effects.loadCards$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        BattleActions.loadCardsSuccess({ leftCard, rightCard }),
      );
      done();
    });
  });

  it('should handle load cards failure', (done) => {
    starWarsService.getRandomItem.mockReturnValue(
      throwError(() => new Error('API error')),
    );

    actions$ = of(BattleActions.loadCards());

    effects.loadCards$.subscribe((resultAction) => {
      expect(resultAction).toEqual(BattleActions.loadCardsFailure());
      done();
    });
  });

  it('should determine winner correctly', (done) => {
    const leftCard: Card = { properties: { mass: '77' } };
    const rightCard: Card = { properties: { mass: '120' } };

    actions$ = of(BattleActions.loadCardsSuccess({ leftCard, rightCard }));

    effects.determineWinner$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        BattleActions.updateScores({ winner: 'right' }),
      );
      done();
    });
  });
});

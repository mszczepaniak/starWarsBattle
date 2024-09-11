import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom, switchMap } from 'rxjs/operators';
import * as BattleActions from './battle-actions';
import * as BattleSelectors from './battle-selectors';
import { StarWarsService } from '../services/star-wars.service';
import { Card, ResourceType, StarWarsItem, Winner } from '../models/models';

@Injectable()
export class BattleEffects {
  loadCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.loadCards),
      withLatestFrom(this.store.select(BattleSelectors.selectResource)),
      switchMap(([_, resource]) =>
        forkJoin({
          leftCard: this.getCardWithRetry(resource),
          rightCard: this.getCardWithRetry(resource),
        }).pipe(
          map(({ leftCard, rightCard }) =>
            BattleActions.loadCardsSuccess({ leftCard, rightCard }),
          ),
          catchError(() => of(BattleActions.loadCardsFailure())),
        ),
      ),
    ),
  );

  determineWinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.loadCardsSuccess),
      withLatestFrom(
        this.store.select(BattleSelectors.selectResource),
        this.store.select(BattleSelectors.selectProperty),
      ),
      map(([{ leftCard, rightCard }, resource, property]) => {
        const getAttribute = (card: Card) => {
          const value = (card.properties as StarWarsItem)[
            property as keyof StarWarsItem
          ];
          return typeof value === 'string' ? parseFloat(value) || 0 : 0;
        };

        const leftValue = getAttribute(leftCard);
        const rightValue = getAttribute(rightCard);

        let winner: Winner = null;
        if (leftValue > rightValue) {
          winner = 'left';
        } else if (rightValue > leftValue) {
          winner = 'right';
        } else {
          winner = 'draw';
        }

        return BattleActions.updateScores({ winner });
      }),
    ),
  );

  private getCardWithRetry(
    resource: ResourceType,
    maxRetries = 10,
  ): Observable<Card> {
    return this.starWarsService.getRandomItem(resource).pipe(
      map((item: StarWarsItem) => ({ properties: item })),
      catchError((error) => {
        if (maxRetries > 0) {
          return this.getCardWithRetry(resource, maxRetries - 1);
        }
        throw error;
      }),
    );
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private starWarsService: StarWarsService,
  ) {}
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as BattleActions from './store/battle-actions';
import * as BattleSelectors from './store/battle-selectors';
import { BattleComponent } from './components/battle/battle.component';
import { ScoreCounterComponent } from './components/score-counter/score-counter.component';
import { ResourceSelectorDialogComponent } from './components/resource-selector/resource-selector-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EndGameDialogComponent } from './components/end-game/end-game.component';
import { Card, ResourceType, Winner } from './models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    BattleComponent,
    ScoreCounterComponent,
  ],
  template: `
    <div class="container" data-cy="main-container">
      <img class="logo" src="logo.png" data-cy="app-logo" />
      <app-score-counter
        [leftScore]="leftScore$ | async"
        [rightScore]="rightScore$ | async"
      ></app-score-counter>
      <app-battle
        [leftCard]="leftCard$ | async"
        [rightCard]="rightCard$ | async"
        [winner]="winner$ | async"
        [selectedResource]="selectedResource$ | async"
        [selectedProperty]="selectedProperty$ | async"
        (playAgain)="playAgain()"
      ></app-battle>
      <div class="button-container" data-cy="game-controls">
        <button
          mat-raised-button
          color="primary"
          (click)="playAgain()"
          [disabled]="isLoading$ | async"
          data-cy="next-round-button"
        >
          Next Round
        </button>
        <button
          mat-raised-button
          color="warn"
          (click)="endGame()"
          class="button"
          data-cy="end-game-button"
        >
          End Game
        </button>
        <button
          mat-raised-button
          color="accent"
          (click)="newGame()"
          data-cy="new-game-button"
        >
          New Game
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      @import 'variables';

      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: $spacing-medium;
        text-align: center;
        display: flex;
        flex-direction: column;
      }

      .logo {
        text-align: center;
        margin-bottom: $spacing-medium;
      }

      .button-container {
        display: flex;
        justify-content: end;
        gap: $spacing-small;
        margin-top: $spacing-xxl;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  selectedResource$: Observable<ResourceType>;
  selectedProperty$: Observable<string>;
  leftCard$: Observable<Card | null>;
  rightCard$: Observable<Card | null>;
  winner$: Observable<Winner>;
  leftScore$: Observable<number>;
  rightScore$: Observable<number>;
  isLoading$: Observable<boolean>;

  constructor(
    public store: Store,
    public dialog: MatDialog,
  ) {
    this.selectedResource$ = this.store.select(BattleSelectors.selectResource);
    this.selectedProperty$ = this.store.select(BattleSelectors.selectProperty);
    this.leftCard$ = this.store.select(BattleSelectors.selectLeftCard);
    this.rightCard$ = this.store.select(BattleSelectors.selectRightCard);
    this.winner$ = this.store.select(BattleSelectors.selectWinner);
    this.leftScore$ = this.store.select(BattleSelectors.selectLeftScore);
    this.rightScore$ = this.store.select(BattleSelectors.selectRightScore);
    this.isLoading$ = this.store.select(BattleSelectors.selectIsLoading);
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    const dialogRef = this.dialog.open(ResourceSelectorDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(BattleActions.resetGame());
        this.store.dispatch(
          BattleActions.setResource({ resource: result.resource }),
        );
        this.store.dispatch(
          BattleActions.setProperty({ property: result.property }),
        );
        this.playAgain();
      }
    });
  }

  playAgain() {
    this.store.dispatch(BattleActions.loadCards());
  }

  endGame() {
    const dialogRef = this.dialog.open(EndGameDialogComponent, {
      data: {
        leftScore: this.leftScore$,
        rightScore: this.rightScore$,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newGame();
      }
    });
  }
}

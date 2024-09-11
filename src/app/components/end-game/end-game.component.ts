import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-end-game-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="end-game-dialog">
      <h1 class="end-game-title" mat-dialog-title data-cy="end-game-title">
        Game Over
      </h1>
      <mat-dialog-content>
        <div class="scores">
          <p data-cy="final-left-score">Left: {{ data.leftScore | async }}</p>
          <p data-cy="final-right-score">
            Right: {{ data.rightScore | async }}
          </p>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button [mat-dialog-close]="true" data-cy="new-game-button">
          New Game
        </button>
        <button mat-button [mat-dialog-close]="false" data-cy="close-button">
          Close
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      @import 'variables';

      .end-game-dialog {
        padding: $spacing-small;
      }

      .end-game-title {
        text-align: center;
        margin-bottom: $spacing-medium;
        font-weight: $font-weight-bold;
      }

      .scores {
        display: flex;
        justify-content: space-between;
        margin-bottom: $spacing-medium;
      }
    `,
  ],
})
export class EndGameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EndGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      leftScore: Observable<number>;
      rightScore: Observable<number>;
    },
  ) {}
}

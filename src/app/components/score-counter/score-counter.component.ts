import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-score-counter',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card data-cy="score-card">
      <mat-card-content>
        <div class="score-container">
          <div class="score" data-cy="left-score">Left: {{ leftScore }}</div>
          <div class="score" data-cy="right-score">Right: {{ rightScore }}</div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      @import 'variables';

      .score-container {
        display: flex;
        justify-content: space-around;

        .score {
          font-size: $font-size-paragraph;
          font-weight: $font-weight-bold;
        }
      }
    `,
  ],
})
export class ScoreCounterComponent {
  @Input() leftScore: number | null = 0;
  @Input() rightScore: number | null = 0;
}

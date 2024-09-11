import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card, ResourceType, StarWarsItem, Winner } from '../../models/models';

@Component({
  selector: 'app-battle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="battle-container" data-cy="battle-container">
      <mat-card
        class="battle-card"
        *ngIf="leftCard"
        [class.winner]="winner === 'left'"
        data-cy="left-card"
      >
        <mat-card-header class="battle-card-header">
          <mat-card-title data-cy="left-card-title">{{
            leftCard.properties.name
          }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p data-cy="left-card-property">
            {{ selectedProperty }}: {{ getAttributeValue(leftCard) }}
          </p>
        </mat-card-content>
      </mat-card>
      <mat-card
        class="battle-card"
        *ngIf="rightCard"
        [class.winner]="winner === 'right'"
        data-cy="right-card"
      >
        <mat-card-header class="battle-card-header">
          <mat-card-title data-cy="right-card-title">{{
            rightCard.properties.name
          }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p data-cy="right-card-property">
            {{ selectedProperty }}: {{ getAttributeValue(rightCard) }}
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      @import 'variables';

      .battle-card {
        padding: $spacing-small;
      }

      .battle-card-header {
        display: flex;
        padding: $spacing-medium;
        justify-content: center;
      }
      .battle-container {
        display: flex;
        justify-content: space-between;
        margin-top: $spacing-medium;
      }

      .winner {
        border: 2px solid $color-winner;
      }

      mat-card {
        width: 45%;
      }
    `,
  ],
})
export class BattleComponent implements OnChanges {
  @Input() leftCard: Card | null = null;
  @Input() rightCard: Card | null = null;
  @Input() winner: Winner = null;
  @Input() selectedResource: ResourceType | null = 'people';
  @Input() selectedProperty: string | null = 'mass';
  @Output() playAgain = new EventEmitter<void>();

  constructor(private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leftCard'] !== null || changes['rightCard'] !== null) {
      const winnerAnnouncement = this.getWinnerAnnouncement();
      if (winnerAnnouncement) {
        this.showNotification(winnerAnnouncement);
      }
    }
  }

  getAttributeValue(card: Card): string {
    if (this.selectedProperty) {
      return card.properties[
        this.selectedProperty as keyof StarWarsItem
      ] as string;
    } else {
      return 'N/A';
    }
  }

  getWinnerAnnouncement(): string {
    if (this.winner === 'draw') return "It's a draw!";
    if (!this.winner) return '';
    return `${this.winner.charAt(0).toUpperCase() + this.winner.slice(1)} player wins this round!`;
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-resource-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="resource-selector-dialog">
      <h2 mat-dialog-title data-cy="resource-selector-title">
        Select Resource and Property
      </h2>
      <mat-dialog-content>
        <form
          [formGroup]="resourceForm"
          class="form-container"
          data-cy="resource-selector-form"
        >
          <mat-form-field
            appearance="fill"
            class="resource-selector-form-field"
          >
            <mat-label>Resource</mat-label>
            <mat-select
              formControlName="resource"
              (selectionChange)="onResourceChange()"
              data-cy="resource-select"
            >
              <mat-option value="people" data-cy="people-option"
                >People</mat-option
              >
              <mat-option value="starships" data-cy="starships-option"
                >Starships</mat-option
              >
            </mat-select>
          </mat-form-field>
          <mat-form-field
            appearance="fill"
            class="resource-selector-form-field"
          >
            <mat-label>Comparison Property</mat-label>
            <mat-select formControlName="property" data-cy="property-select">
              <mat-option
                *ngFor="let prop of availableProperties"
                [value]="prop"
                [attr.data-cy]="prop + '-option'"
              >
                {{ prop }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button (click)="onCancel()" data-cy="cancel-button">
          Cancel
        </button>
        <button
          mat-button
          [mat-dialog-close]="resourceForm.value"
          [disabled]="resourceForm.invalid"
          cdkFocusInitial
          data-cy="start-game-button"
        >
          Start New Game
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      @import 'variables';

      .resource-selector-dialog {
        padding: $spacing-small;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: $spacing-small;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class ResourceSelectorDialogComponent implements OnInit {
  resourceForm: FormGroup;
  availableProperties: string[] = ['mass', 'height'];

  constructor(
    public dialogRef: MatDialogRef<ResourceSelectorDialogComponent>,
    private fb: FormBuilder,
  ) {
    this.resourceForm = this.fb.group({
      resource: ['people', Validators.required],
      property: ['mass', Validators.required],
    });
  }

  ngOnInit() {
    this.onResourceChange();
  }

  onResourceChange(): void {
    const resource = this.resourceForm.get('resource')?.value;
    if (resource === 'people') {
      this.availableProperties = ['mass', 'height'];
      this.resourceForm.patchValue({ property: 'mass' });
    } else {
      this.availableProperties = ['length', 'crew', 'passengers'];
      this.resourceForm.patchValue({ property: 'length' });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

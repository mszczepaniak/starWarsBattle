import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndGameDialogComponent } from './end-game.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EndGameDialogComponent', () => {
  let component: EndGameDialogComponent;
  let fixture: ComponentFixture<EndGameDialogComponent>;
  let mockDialogRef: Partial<MatDialogRef<EndGameDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EndGameDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { leftScore: of(3), rightScore: of(2) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EndGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display final scores', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const leftScoreElement = fixture.debugElement.query(
      By.css('[data-cy="final-left-score"]'),
    ).nativeElement;
    const rightScoreElement = fixture.debugElement.query(
      By.css('[data-cy="final-right-score"]'),
    ).nativeElement;

    expect(leftScoreElement.textContent).toContain('Left: 3');
    expect(rightScoreElement.textContent).toContain('Right: 2');
  });

  it('should close dialog with true when new game button is clicked', () => {
    const newGameButton = fixture.debugElement.query(
      By.css('[data-cy="new-game-button"]'),
    ).nativeElement;
    newGameButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(
      By.css('[data-cy="close-button"]'),
    ).nativeElement;
    closeButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});

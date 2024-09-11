import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattleComponent } from './battle.component';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('BattleComponent', () => {
  let component: BattleComponent;
  let fixture: ComponentFixture<BattleComponent>;
  let mockSnackBar: Partial<MatSnackBar>;

  beforeEach(async () => {
    mockSnackBar = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BattleComponent],
      providers: [{ provide: MatSnackBar, useValue: mockSnackBar }],
    }).compileComponents();

    fixture = TestBed.createComponent(BattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show notification when winner changes', () => {
    component.winner = 'left';
    component.ngOnChanges({
      winner: {
        currentValue: 'left',
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

  it('should get correct attribute value', () => {
    const card = { properties: { mass: '75' } };
    component.selectedProperty = 'mass';
    expect(component.getAttributeValue(card)).toBe('75');
  });

  it('should get correct winner announcement', () => {
    component.winner = 'left';
    expect(component.getWinnerAnnouncement()).toBe(
      'Left player wins this round!',
    );
  });
});

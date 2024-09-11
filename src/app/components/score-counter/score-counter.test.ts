import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreCounterComponent } from './score-counter.component';
import { By } from '@angular/platform-browser';

describe('ScoreCounterComponent', () => {
  let component: ScoreCounterComponent;
  let fixture: ComponentFixture<ScoreCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initial scores', () => {
    const leftScoreElement = fixture.debugElement.query(
      By.css('[data-cy="left-score"]'),
    ).nativeElement;
    const rightScoreElement = fixture.debugElement.query(
      By.css('[data-cy="right-score"]'),
    ).nativeElement;

    expect(leftScoreElement.textContent).toContain('Left: 0');
    expect(rightScoreElement.textContent).toContain('Right: 0');
  });

  it('should update scores when inputs change', () => {
    component.leftScore = 3;
    component.rightScore = 2;
    fixture.detectChanges();

    const leftScoreElement = fixture.debugElement.query(
      By.css('[data-cy="left-score"]'),
    ).nativeElement;
    const rightScoreElement = fixture.debugElement.query(
      By.css('[data-cy="right-score"]'),
    ).nativeElement;

    expect(leftScoreElement.textContent).toContain('Left: 3');
    expect(rightScoreElement.textContent).toContain('Right: 2');
  });
});

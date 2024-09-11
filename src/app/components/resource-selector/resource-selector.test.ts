import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceSelectorDialogComponent } from './resource-selector-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

describe('ResourceSelectorDialogComponent', () => {
  let component: ResourceSelectorDialogComponent;
  let fixture: ComponentFixture<ResourceSelectorDialogComponent>;
  let mockDialogRef: Partial<MatDialogRef<ResourceSelectorDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ResourceSelectorDialogComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.resourceForm.get('resource')?.value).toBe('people');
    expect(component.resourceForm.get('property')?.value).toBe('mass');
    expect(component.availableProperties).toEqual(['mass', 'height']);
  });

  it('should change available properties when resource changes', () => {
    component.resourceForm.patchValue({ resource: 'starships' });
    component.onResourceChange();
    expect(component.availableProperties).toEqual([
      'length',
      'crew',
      'passengers',
    ]);
    expect(component.resourceForm.get('property')?.value).toBe('length');
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog with selected values on start game', () => {
    const startButton = fixture.debugElement.query(
      By.css('[data-cy="start-game-button"]'),
    ).nativeElement;
    startButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      resource: 'people',
      property: 'mass',
    });
  });
});

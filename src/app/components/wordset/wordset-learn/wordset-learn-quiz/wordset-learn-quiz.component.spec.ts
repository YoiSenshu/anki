import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsetLearnQuizComponent } from './wordset-learn-quiz.component';

describe('WordsetLearnQuizComponent', () => {
  let component: WordsetLearnQuizComponent;
  let fixture: ComponentFixture<WordsetLearnQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsetLearnQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsetLearnQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

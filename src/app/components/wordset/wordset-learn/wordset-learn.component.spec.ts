import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordsetLearnFlashcardComponent } from './wordset-learn-flashcard/wordset-learn-flashcard.component';

import { WordsetLearnComponent } from './wordset-learn.component';

describe('WordsetLearnComponent', () => {
  let component: WordsetLearnComponent;
  let fixture: ComponentFixture<WordsetLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsetLearnComponent, WordsetLearnFlashcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsetLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

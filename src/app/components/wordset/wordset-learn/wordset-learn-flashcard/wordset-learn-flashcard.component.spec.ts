import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsetLearnFlashcardComponent } from './wordset-learn-flashcard.component';

describe('WordsetLearnFlashcardComponent', () => {
  let component: WordsetLearnFlashcardComponent;
  let fixture: ComponentFixture<WordsetLearnFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsetLearnFlashcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsetLearnFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsetLearnDefinitionComponent } from './wordset-learn-definition.component';

describe('WordsetLearnDefinitionComponent', () => {
  let component: WordsetLearnDefinitionComponent;
  let fixture: ComponentFixture<WordsetLearnDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsetLearnDefinitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsetLearnDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

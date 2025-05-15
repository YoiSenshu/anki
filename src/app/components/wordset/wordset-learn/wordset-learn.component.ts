import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WordsetService } from '../../../services/wordset.service';
import { Wordset, WordEntry } from '../../../models/wordset.model';
import { WordsetLearnFlashcardComponent } from './wordset-learn-flashcard/wordset-learn-flashcard.component';
import { WordsetLearnQuizComponent } from './wordset-learn-quiz/wordset-learn-quiz.component';
import { WordsetLearnDefinitionComponent } from './wordset-learn-definition/wordset-learn-definition.component';
import { BehaviorSubject } from 'rxjs';
import { Round, RoundElement } from './round.models';

@Component({
    selector: 'app-wordset-learn',
    standalone: true,
    imports: [
        CommonModule,
        WordsetLearnFlashcardComponent,
        WordsetLearnQuizComponent,
        WordsetLearnDefinitionComponent
    ],
    templateUrl: './wordset-learn.component.html',
    styleUrls: ['./wordset-learn.component.css']
})
export class WordsetLearnComponent implements OnInit {
    wordset: Wordset | null = null;
    currentWordEntry = new BehaviorSubject<WordEntry | null>(null);
    currentRound: Round | null = null;
    currentElementIndex = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wordsetService: WordsetService
    ) {}

    ngOnInit() {
        const wordsetId = this.route.snapshot.paramMap.get('id');
        if (wordsetId) {
            this.wordsetService.getWordsetById(parseInt(wordsetId)).subscribe(wordset => {
                this.wordset = wordset;
                this.generateRound();
            });
        }
    }

    generateRound() {
        if (!this.wordset) return;

        const elements: RoundElement[] = [];
        const words = [...this.wordset.wordEntries];

        // Shuffle words
        words.sort(() => Math.random() - 0.5);

        // Take first 10 words or all if less than 10
        const selectedWords = words.slice(0, 10);

        // For each word, create a sequence of elements
        selectedWords.forEach(word => {
            elements.push({ type: 'flashcard', wordEntry: word });
            elements.push({ type: 'quiz', wordEntry: word });
            elements.push({ type: 'definition', wordEntry: word });
        });

        // Shuffle all elements
        elements.sort(() => Math.random() - 0.5);

        this.currentRound = { elements: elements };
        this.currentElementIndex = 0;
        this.currentWordEntry.next(this.currentRound.elements[0].wordEntry);
    }

    onNext(correct: boolean) {
        if (!this.currentRound) return;

        this.currentElementIndex++;
        if (this.currentElementIndex < this.currentRound.elements.length) {
            this.currentWordEntry.next(this.currentRound.elements[this.currentElementIndex].wordEntry);
        } else {
            this.currentRound = null;
            this.currentWordEntry.next(null);
        }
    }

    startNewRound() {
        this.generateRound();
    }
}
  
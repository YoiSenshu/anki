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
import { ProgressesService } from '../../../services/progresses.service';
import { Progress, getEntryProgress, getLearningElementType } from '../../../models/progress.model';
import { calculateProgress } from '../../../models/progress.model';

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
    progress: Progress | null = null;

    currentWordEntry = new BehaviorSubject<WordEntry | null>(null);
    currentRound: Round | null = null;
    currentElementIndex = 0;

    roundProgressPercentage = 0;
    totalProgressPercentage = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wordsetService: WordsetService,
        private progressesService: ProgressesService
    ) {}

    ngOnInit() {
        const wordsetId = this.route.snapshot.paramMap.get('id');
        if (wordsetId) {
            this.wordsetService.getWordsetById(parseInt(wordsetId)).subscribe(wordset => {
                this.wordset = wordset;
                this.progressesService.getProgressForWordset(wordsetId).subscribe(progress => {
                    if (progress) {
                        this.progress = progress;
                    } else if (this.wordset) {
                        this.progressesService.createEmpty(this.wordset).subscribe(newProgress => {
                            this.progress = newProgress;
                        });
                    }
                    this.generateRound();
                });
            });
        }
    }

    generateRound() {
        if (!this.wordset || !this.progress) return;

        const elements: RoundElement[] = [];
        const words = [...this.wordset.wordEntries];

        // Shuffle words
        words.sort(() => Math.random() - 0.5);

        // Filter words that are in progress (not 'definitionCorrect')
        const inProgressWords = words.filter(word => {
            const progress = getEntryProgress(this.progress!, word);
            return progress !== 'definitionCorrect';
        });

        // Take first 7 words or all if less than 7
        let selectedWords = inProgressWords.slice(0, 7);

        // If we have less than 7 words, add 'not shown' words to reach 7
        if (selectedWords.length < 7) {
            const notShownWords = words.filter(word => {
                const progress = getEntryProgress(this.progress!, word);
                return progress === 'not shown';
            });
            const additionalWords = notShownWords.slice(0, 7 - selectedWords.length);
            selectedWords = [...selectedWords, ...additionalWords];
        }

        // For each word, create an element based on its progress
        selectedWords.forEach(word => {
            const progress = getEntryProgress(this.progress!, word);
            const elementType = getLearningElementType(progress);
            elements.push({ type: elementType, wordEntry: word });
        });

        // Shuffle all elements
        elements.sort(() => Math.random() - 0.5);

        if(elements.length === 0) {
            this.currentRound = null;
            this.currentWordEntry.next(null);
            console.log("NAUKA UKOŃCZONA");
            return;
        }

        this.currentRound = { elements };
        this.currentElementIndex = 0;
        this.currentWordEntry.next(this.currentRound.elements[0].wordEntry);
        this.roundProgressPercentage = 0;

        if (this.wordset && this.progress) {
            this.totalProgressPercentage = calculateProgress(this.wordset, this.progress);
        }

        //console.log(this.currentRound);
    }

    onNext(correct: boolean) {
        if (!this.currentRound) return;

        // save progress
        const element = this.currentRound.elements[this.currentElementIndex];
        
        if(this.progress) {

            this.progress.progress.flashcard = this.progress.progress.flashcard.filter(word => word !== element.wordEntry.word);
            this.progress.progress.quizWrong = this.progress.progress.quizWrong.filter(word => word !== element.wordEntry.word);
            this.progress.progress.quizCorrect = this.progress.progress.quizCorrect.filter(word => word !== element.wordEntry.word);
            this.progress.progress.definitionWrong = this.progress.progress.definitionWrong.filter(word => word !== element.wordEntry.word);

            if(element.type === 'flashcard') {
                this.progress?.progress.flashcard.push(element.wordEntry.word);
            } else if(element.type === 'quiz') {
                if(correct) {
                    this.progress?.progress.quizCorrect.push(element.wordEntry.word);
                } else {
                    this.progress?.progress.quizWrong.push(element.wordEntry.word);
                }
            } else if(element.type === 'definition') {
                if(correct) {
                    this.progress?.progress.definitionCorrect.push(element.wordEntry.word);
                } else {
                    this.progress?.progress.definitionWrong.push(element.wordEntry.word);
                }
            }

            console.log(this.progress);
        }

        this.currentElementIndex++;
        this.roundProgressPercentage = (this.currentElementIndex / this.currentRound.elements.length) * 100;
        
        if (this.currentElementIndex < this.currentRound.elements.length) {
            this.currentWordEntry.next(this.currentRound.elements[this.currentElementIndex].wordEntry);
            
            if (this.wordset && this.progress) {
                this.totalProgressPercentage = calculateProgress(this.wordset, this.progress);
            }
        } else {
            this.currentRound = null;
            this.currentWordEntry.next(null);
        }

        if(this.progress) {
            this.progressesService.updateProgress(this.progress).subscribe();
            console.log("progress updated");
        }
    }

    startNewRound() {
        this.generateRound();
    }
}
  
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordEntry, Wordset } from '../../../../models/wordset.model';
import { BehaviorSubject } from 'rxjs';

interface QuizAnswer {
    text: string;
    isCorrect: boolean;
    isSelected: boolean;
}

@Component({
    selector: 'app-wordset-learn-quiz',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './wordset-learn-quiz.component.html',
    styleUrls: ['./wordset-learn-quiz.component.css']
})
export class WordsetLearnQuizComponent {
    @Input() wordset!: Wordset;
    @Input({required: true}) wordEntry!: BehaviorSubject<WordEntry | null>;
    @Output() next = new EventEmitter<boolean>();

    answers: QuizAnswer[] = [];
    showNextButton = false;
    selectedAnswer: QuizAnswer | null = null;

    ngOnInit() {
        this.generateAnswers();
        this.wordEntry.subscribe((wordEntry) => {
            this.showNextButton = false;
            this.selectedAnswer = null;
            this.generateAnswers();
        });
    }

    private generateAnswers() {
        // Create correct answer
        const correctAnswer: QuizAnswer = {
            text: this.wordEntry.value?.definition ?? '',
            isCorrect: true,
            isSelected: false
        };

        // Get other words for wrong answers
        const otherWords = this.wordset.wordEntries
            .filter(word => word.word !== this.wordEntry.value?.word)
            .map(word => word.definition);

        // Shuffle and take up to 3 wrong answers
        const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);

        // Create wrong answers
        const wrongAnswers: QuizAnswer[] = shuffled.map(text => ({
            text,
            isCorrect: false,
            isSelected: false
        }));

        // If we don't have enough wrong answers, duplicate some
        while (wrongAnswers.length < 3 && wrongAnswers.length > 0) {
            const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
            wrongAnswers.push({...wrongAnswers[randomIndex]});
        }

        // Combine and shuffle all answers
        this.answers = [correctAnswer, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);

        // Ensure we have at least 2 answers (correct + at least one wrong)
        if (this.answers.length < 2) {
            this.answers = [correctAnswer];
        }

        // Double check that correct answer is in the array
        if (!this.answers.some(a => a.isCorrect)) {
            this.answers = [correctAnswer];
        }
    }

    selectAnswer(answer: QuizAnswer) {
        if (this.showNextButton) return; // Prevent changing answer after selection

        this.selectedAnswer = answer;
        answer.isSelected = true;
        this.showNextButton = true;
    }

    nextQuestion() {
        this.next.emit(this.selectedAnswer?.isCorrect ?? false);
    }
}

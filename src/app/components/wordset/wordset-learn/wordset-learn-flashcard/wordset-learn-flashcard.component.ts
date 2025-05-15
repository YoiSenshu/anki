import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordEntry } from '../../../../models/wordset.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-wordset-learn-flashcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wordset-learn-flashcard.component.html',
  styleUrls: ['./wordset-learn-flashcard.component.css']
})
export class WordsetLearnFlashcardComponent implements OnInit {

    @Input() wordEntry!: BehaviorSubject<WordEntry | null>;
    @Output() next: EventEmitter<boolean> = new EventEmitter<boolean>();
    public isFlipped: boolean = false;

    ngOnInit(): void {
        this.wordEntry.subscribe(() => this.isFlipped = false);
    }

    public flip() {
        this.isFlipped = !this.isFlipped;
    }

    public onNext() {
        this.next.emit(true);
    }
}

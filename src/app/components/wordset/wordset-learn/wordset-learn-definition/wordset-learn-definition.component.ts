import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordEntry } from '../../../../models/wordset.model';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-wordset-learn-definition',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './wordset-learn-definition.component.html',
    styleUrls: ['./wordset-learn-definition.component.css']
})
export class WordsetLearnDefinitionComponent implements OnInit {
    @Input({required: true}) wordEntry!: BehaviorSubject<WordEntry | null>;
    @Output() next = new EventEmitter<boolean>();

    definitionForm: FormGroup;
    showNextButton = false;
    isCorrect = false;

    constructor(private fb: FormBuilder) {
        this.definitionForm = this.fb.group({
            word: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.wordEntry.subscribe(() => {
            this.resetForm();
        });
    }

    resetForm() {
        this.definitionForm.reset();
        this.showNextButton = false;
        this.isCorrect = false;
    }

    onSubmit() {
        if (this.definitionForm.invalid) return;

        const enteredWord = this.definitionForm.get('word')?.value.toLowerCase().trim();
        const correctWord = this.wordEntry.value?.word.toLowerCase().trim();
        
        this.isCorrect = enteredWord === correctWord;
        this.showNextButton = true;
    }

    nextQuestion() {
        this.next.emit(this.isCorrect);
        this.resetForm();
    }
}

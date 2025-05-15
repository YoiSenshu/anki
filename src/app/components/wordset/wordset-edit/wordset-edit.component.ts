import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WordsetService } from '../../../services/wordset.service';
import { Wordset } from '../../../models/wordset.model';
import { CanComponentDeactivate } from '../../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-wordset-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './wordset-edit.component.html',
  styleUrls: ['./wordset-edit.component.css']
})
export class WordsetEditComponent implements OnInit, CanComponentDeactivate {
  wordsetForm: FormGroup;
  wordset: Wordset | null = null;
  private initialFormValue: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private wordsetService: WordsetService
  ) {
    this.wordsetForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      wordEntries: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.wordsetService.getWordsetById(id).subscribe(wordset => {
          this.wordset = wordset;
          this.wordsetForm.patchValue({
            title: wordset.title,
            description: wordset.description
          });
          
          // Clear existing entries
          while (this.wordEntries.length) {
            this.wordEntries.removeAt(0);
          }
          
          // Add existing entries
          wordset.wordEntries.forEach(entry => {
            this.addWordEntry(entry.word, entry.definition);
          });

          // Store initial form value for change detection
          this.initialFormValue = JSON.stringify(this.wordsetForm.value);
        });
      }
    });
  }

  get wordEntries() {
    return this.wordsetForm.get('wordEntries') as FormArray;
  }

  addWordEntry(word: string = '', definition: string = '') {
    const wordEntry = this.fb.group({
      word: [word, Validators.required],
      definition: [definition, Validators.required]
    });
    this.wordEntries.push(wordEntry);
  }

  removeWordEntry(index: number) {
    this.wordEntries.removeAt(index);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.wordsetForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isWordEntryInvalid(index: number, fieldName: string): boolean {
    const entry = this.wordEntries.at(index);
    const field = entry.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.wordsetForm.valid) {
      console.log(this.wordsetForm.value);
      this.initialFormValue = JSON.stringify(this.wordsetForm.value);
    } else {
      this.markFormGroupTouched(this.wordsetForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  hasUnsavedChanges(): boolean {
    return this.initialFormValue !== JSON.stringify(this.wordsetForm.value);
  }
} 
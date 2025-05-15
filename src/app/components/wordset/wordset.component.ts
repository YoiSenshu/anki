import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WordsetService } from '../../services/wordset.service';
import { ProgressesService } from '../../services/progresses.service';
import { Wordset } from '../../models/wordset.model';
import { calculateProgress, Progress } from '../../models/progress.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-wordset',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wordset.component.html',
  styleUrls: ['./wordset.component.css']
})
export class WordsetComponent implements OnInit {
  wordset: Wordset | null = null;
  public progress: Progress | null = null;
  progressPercentage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private wordsetService: WordsetService,
    private progressesService: ProgressesService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
        switchMap(params => {
            const id = +params['id'];
            return this.wordsetService.getWordsetById(id);
        }),
        switchMap(wordset => {
            this.wordset = wordset;
            return this.progressesService.getProgressForWordset(wordset.id + "");
        })
    ).subscribe(progress => {
        if (progress) {
            this.progress = progress;
        } else if (this.wordset) {
            this.progressesService.createEmpty(this.wordset).subscribe(newProgress => {
                this.progress = newProgress;
                if (this.wordset && this.progress) {
                    this.progressPercentage = calculateProgress(this.wordset, this.progress);
                }
            });
        }
        if (this.wordset && this.progress) {
            this.progressPercentage = calculateProgress(this.wordset, this.progress);
        }
    });
  }
}

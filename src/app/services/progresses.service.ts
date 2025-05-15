import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Progress } from '../models/progress.model';
import { Wordset } from '../models/wordset.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProgressForWordset(wordsetId: string): Observable<Progress | null> {
    return this.http.get<Progress[]>(`${this.apiUrl}/progresses?wordsetId=${wordsetId}`)
      .pipe(
        map(progresses => progresses.length > 0 ? progresses[0] : null)
      );
  }

  updateProgress(progress: Progress) {
    return this.http.put<Progress>(`${this.apiUrl}/progresses/${progress.id}`, progress);
  }

  createEmpty(wordset: Wordset): Observable<Progress> {
    const emptyProgress: Omit<Progress, 'id'> = {
      wordsetId: wordset.id,
      progress: {
        flashcard: [],
        quizWrong: [],
        quizCorrect: [],
        definitionWrong: [],
        definitionCorrect: []
      }
    };

    return this.http.post<Progress>(`${this.apiUrl}/progresses`, emptyProgress);
  }

  calculateProgressPercentage(progress: Progress): number {
    const totalWords = Object.values(progress.progress).flat().length;
    const completedWords = progress.progress.definitionCorrect.length + 
                         progress.progress.quizCorrect.length;
    
    if (totalWords === 0) return 0;
    return Math.round((completedWords / totalWords) * 100);
  }
} 
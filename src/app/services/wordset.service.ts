import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Wordset } from '../models/wordset.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordsetService {
  private apiUrl:string = environment.apiUrl;
  private nextId: number = 1;

  constructor(private http: HttpClient) {
    // Load existing wordsets to determine next ID
    this.getWordsets().subscribe(wordsets => {
      if (wordsets.length > 0) {
        this.nextId = Math.max(...wordsets.map(w => +w.id)) + 1;
      }
    });
  }

  getWordsets(): Observable<Wordset[]> {
    return this.http.get<Wordset[]>(`${this.apiUrl}/wordsets`).pipe(
      map(wordsets => wordsets.map(w => ({
        ...w,
        id: w.id // Ensure ID is a number
      })))
    );
  }

  getWordsetById(id: number): Observable<Wordset> {
    return this.http.get<Wordset>(`${this.apiUrl}/wordsets/${id}`).pipe(
      map(wordset => ({
        ...wordset,
        id: wordset.id // Ensure ID is a number
      }))
    );
  }

  createEmpty(): Observable<Wordset> {
    const emptyWordset: Omit<Wordset, 'id'> = {
      title: 'Nowy zestaw',
      description: '',
      wordEntries: []
    };

    // Add ID explicitly as a number
    const wordsetWithId = {
      ...emptyWordset,
      id: this.nextId++
    };

    return this.http.post<Wordset>(`${this.apiUrl}/wordsets`, wordsetWithId).pipe(
      map(wordset => ({
        ...wordset,
        id: `${wordset.id}` // Ensure ID is a number
      }))
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordsetListItemComponent } from './wordset-list-item/wordset-list-item.component';
import { WordsetService } from '../../services/wordset.service';
import { Wordset } from '../../models/wordset.model';

@Component({
  selector: 'app-wordset-list',
  standalone: true,
  imports: [CommonModule, WordsetListItemComponent],
  templateUrl: './wordset-list.component.html',
  styleUrls: ['./wordset-list.component.css']
})
export class WordsetListComponent implements OnInit {
  wordsets: Wordset[] = [];

  constructor(private wordsetService: WordsetService) {}

  ngOnInit(): void {
    this.wordsetService.getWordsets().subscribe(
      wordsets => this.wordsets = wordsets
    );
  }
} 